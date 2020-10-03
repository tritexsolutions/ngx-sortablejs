import { InjectionToken, ɵɵdefineInjectable, ɵsetClassMetadata, Injectable, EventEmitter, ɵɵdirectiveInject, ElementRef, NgZone, Renderer2, ɵɵdefineDirective, ɵɵNgOnChangesFeature, Directive, Optional, Inject, Input, Output, ɵɵdefineNgModule, ɵɵdefineInjector, ɵɵsetNgModuleScope, NgModule } from '@angular/core';
import Sortable from 'sortablejs';

const GLOBALS = new InjectionToken('Global config for sortablejs');

class SortablejsBinding {
    constructor(target) {
        this.target = target;
    }
    insert(index, item) {
        if (this.isFormArray) {
            this.target.insert(index, item);
        }
        else {
            this.target.splice(index, 0, item);
        }
    }
    get(index) {
        return this.isFormArray ? this.target.at(index) : this.target[index];
    }
    remove(index) {
        let item;
        if (this.isFormArray) {
            item = this.target.at(index);
            this.target.removeAt(index);
        }
        else {
            item = this.target.splice(index, 1)[0];
        }
        return item;
    }
    // we need this to identify that the target is a FormArray
    // we don't want to have a dependency on @angular/forms just for that
    get isFormArray() {
        // just checking for random FormArray methods not available on a standard array
        return !!this.target.at && !!this.target.insert && !!this.target.reset;
    }
}

class SortablejsBindings {
    constructor(bindingTargets) {
        this.bindings = bindingTargets.map(target => new SortablejsBinding(target));
    }
    injectIntoEvery(index, items) {
        this.bindings.forEach((b, i) => b.insert(index, items[i]));
    }
    getFromEvery(index) {
        return this.bindings.map(b => b.get(index));
    }
    extractFromEvery(index) {
        return this.bindings.map(b => b.remove(index));
    }
    get provided() {
        return !!this.bindings.length;
    }
}

class SortablejsService {
}
SortablejsService.ɵfac = function SortablejsService_Factory(t) { return new (t || SortablejsService)(); };
SortablejsService.ɵprov = ɵɵdefineInjectable({ token: SortablejsService, factory: SortablejsService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { ɵsetClassMetadata(SortablejsService, [{
        type: Injectable,
        args: [{
                providedIn: 'root',
            }]
    }], null, null); })();

const getIndexesFromEvent = (event) => {
    if (event.hasOwnProperty('newDraggableIndex') && event.hasOwnProperty('oldDraggableIndex')) {
        return {
            new: event.newDraggableIndex,
            old: event.oldDraggableIndex,
        };
    }
    else {
        return {
            new: event.newIndex,
            old: event.oldIndex,
        };
    }
};
class SortablejsDirective {
    constructor(globalConfig, service, element, zone, renderer) {
        this.globalConfig = globalConfig;
        this.service = service;
        this.element = element;
        this.zone = zone;
        this.renderer = renderer;
        this.runInsideAngular = false; // to be deprecated
        this.sortablejsInit = new EventEmitter();
    }
    ngOnInit() {
        if (Sortable && Sortable.create) { // Sortable does not exist in angular universal (SSR)
            if (this.runInsideAngular) {
                this.create();
            }
            else {
                this.zone.runOutsideAngular(() => this.create());
            }
        }
    }
    ngOnChanges(changes) {
        const optionsChange = changes.sortablejsOptions;
        if (optionsChange && !optionsChange.isFirstChange()) {
            const previousOptions = optionsChange.previousValue;
            const currentOptions = optionsChange.currentValue;
            Object.keys(currentOptions).forEach(optionName => {
                if (currentOptions[optionName] !== previousOptions[optionName]) {
                    // use low-level option setter
                    this.sortableInstance.option(optionName, this.options[optionName]);
                }
            });
        }
    }
    ngOnDestroy() {
        if (this.sortableInstance) {
            this.sortableInstance.destroy();
        }
    }
    create() {
        const container = this.sortablejsContainer ? this.element.nativeElement.querySelector(this.sortablejsContainer) : this.element.nativeElement;
        setTimeout(() => {
            this.sortableInstance = Sortable.create(container, this.options);
            this.sortablejsInit.emit(this.sortableInstance);
        }, 0);
    }
    getBindings() {
        if (!this.sortablejs) {
            return new SortablejsBindings([]);
        }
        else if (this.sortablejs instanceof SortablejsBindings) {
            return this.sortablejs;
        }
        else {
            return new SortablejsBindings([this.sortablejs]);
        }
    }
    get options() {
        return Object.assign(Object.assign({}, this.optionsWithoutEvents), this.overridenOptions);
    }
    get optionsWithoutEvents() {
        return Object.assign(Object.assign({}, (this.globalConfig || {})), (this.sortablejsOptions || {}));
    }
    proxyEvent(eventName, ...params) {
        this.zone.run(() => {
            if (this.optionsWithoutEvents && this.optionsWithoutEvents[eventName]) {
                this.optionsWithoutEvents[eventName](...params);
            }
        });
    }
    get isCloning() {
        return this.sortableInstance.options.group.checkPull(this.sortableInstance, this.sortableInstance) === 'clone';
    }
    clone(item) {
        // by default pass the item through, no cloning performed
        return (this.sortablejsCloneFunction || (subitem => subitem))(item);
    }
    get overridenOptions() {
        // always intercept standard events but act only in case items are set (bindingEnabled)
        // allows to forget about tracking this.items changes
        return {
            onAdd: (event) => {
                this.service.transfer = (items) => {
                    this.getBindings().injectIntoEvery(event.newIndex, items);
                    this.proxyEvent('onAdd', event);
                };
                this.proxyEvent('onAddOriginal', event);
            },
            onRemove: (event) => {
                const bindings = this.getBindings();
                if (bindings.provided) {
                    if (this.isCloning) {
                        this.service.transfer(bindings.getFromEvery(event.oldIndex).map(item => this.clone(item)));
                        // great thanks to https://github.com/tauu
                        // event.item is the original item from the source list which is moved to the target list
                        // event.clone is a clone of the original item and will be added to source list
                        // If bindings are provided, adding the item dom element to the target list causes artifacts
                        // as it interferes with the rendering performed by the angular template.
                        // Therefore we remove it immediately and also move the original item back to the source list.
                        // (event handler may be attached to the original item and not its clone, therefore keeping
                        // the original dom node, circumvents side effects )
                        this.renderer.removeChild(event.item.parentNode, event.item);
                        this.renderer.insertBefore(event.clone.parentNode, event.item, event.clone);
                        this.renderer.removeChild(event.clone.parentNode, event.clone);
                    }
                    else {
                        this.service.transfer(bindings.extractFromEvery(event.oldIndex));
                    }
                    this.service.transfer = null;
                }
                this.proxyEvent('onRemove', event);
            },
            onUpdate: (event) => {
                const bindings = this.getBindings();
                const indexes = getIndexesFromEvent(event);
                bindings.injectIntoEvery(indexes.new, bindings.extractFromEvery(indexes.old));
                this.proxyEvent('onUpdate', event);
            },
        };
    }
}
SortablejsDirective.ɵfac = function SortablejsDirective_Factory(t) { return new (t || SortablejsDirective)(ɵɵdirectiveInject(GLOBALS, 8), ɵɵdirectiveInject(SortablejsService), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone), ɵɵdirectiveInject(Renderer2)); };
SortablejsDirective.ɵdir = ɵɵdefineDirective({ type: SortablejsDirective, selectors: [["", "sortablejs", ""]], inputs: { sortablejs: "sortablejs", sortablejsContainer: "sortablejsContainer", sortablejsOptions: "sortablejsOptions", sortablejsCloneFunction: "sortablejsCloneFunction", runInsideAngular: "runInsideAngular" }, outputs: { sortablejsInit: "sortablejsInit" }, features: [ɵɵNgOnChangesFeature] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(SortablejsDirective, [{
        type: Directive,
        args: [{
                selector: '[sortablejs]',
            }]
    }], function () { return [{ type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [GLOBALS]
            }] }, { type: SortablejsService }, { type: ElementRef }, { type: NgZone }, { type: Renderer2 }]; }, { sortablejs: [{
            type: Input
        }], sortablejsContainer: [{
            type: Input
        }], sortablejsOptions: [{
            type: Input
        }], sortablejsCloneFunction: [{
            type: Input
        }], runInsideAngular: [{
            type: Input
        }], sortablejsInit: [{
            type: Output
        }] }); })();

class SortablejsModule {
    static forRoot(globalOptions) {
        return {
            ngModule: SortablejsModule,
            providers: [
                { provide: GLOBALS, useValue: globalOptions },
            ],
        };
    }
}
SortablejsModule.ɵmod = ɵɵdefineNgModule({ type: SortablejsModule });
SortablejsModule.ɵinj = ɵɵdefineInjector({ factory: function SortablejsModule_Factory(t) { return new (t || SortablejsModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(SortablejsModule, { declarations: [SortablejsDirective], exports: [SortablejsDirective] }); })();
/*@__PURE__*/ (function () { ɵsetClassMetadata(SortablejsModule, [{
        type: NgModule,
        args: [{
                declarations: [SortablejsDirective],
                exports: [SortablejsDirective],
            }]
    }], null, null); })();

/**
 * Generated bundle index. Do not edit.
 */

export { SortablejsDirective, SortablejsModule };
//# sourceMappingURL=ngx-sortablejs.js.map
