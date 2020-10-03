import { __assign, __spread } from 'tslib';
import { InjectionToken, ɵɵdefineInjectable, ɵsetClassMetadata, Injectable, EventEmitter, ɵɵdirectiveInject, ElementRef, NgZone, Renderer2, ɵɵdefineDirective, ɵɵNgOnChangesFeature, Directive, Optional, Inject, Input, Output, ɵɵdefineNgModule, ɵɵdefineInjector, ɵɵsetNgModuleScope, NgModule } from '@angular/core';
import Sortable from 'sortablejs';

var GLOBALS = new InjectionToken('Global config for sortablejs');

var SortablejsBinding = /** @class */ (function () {
    function SortablejsBinding(target) {
        this.target = target;
    }
    SortablejsBinding.prototype.insert = function (index, item) {
        if (this.isFormArray) {
            this.target.insert(index, item);
        }
        else {
            this.target.splice(index, 0, item);
        }
    };
    SortablejsBinding.prototype.get = function (index) {
        return this.isFormArray ? this.target.at(index) : this.target[index];
    };
    SortablejsBinding.prototype.remove = function (index) {
        var item;
        if (this.isFormArray) {
            item = this.target.at(index);
            this.target.removeAt(index);
        }
        else {
            item = this.target.splice(index, 1)[0];
        }
        return item;
    };
    Object.defineProperty(SortablejsBinding.prototype, "isFormArray", {
        // we need this to identify that the target is a FormArray
        // we don't want to have a dependency on @angular/forms just for that
        get: function () {
            // just checking for random FormArray methods not available on a standard array
            return !!this.target.at && !!this.target.insert && !!this.target.reset;
        },
        enumerable: true,
        configurable: true
    });
    return SortablejsBinding;
}());

var SortablejsBindings = /** @class */ (function () {
    function SortablejsBindings(bindingTargets) {
        this.bindings = bindingTargets.map(function (target) { return new SortablejsBinding(target); });
    }
    SortablejsBindings.prototype.injectIntoEvery = function (index, items) {
        this.bindings.forEach(function (b, i) { return b.insert(index, items[i]); });
    };
    SortablejsBindings.prototype.getFromEvery = function (index) {
        return this.bindings.map(function (b) { return b.get(index); });
    };
    SortablejsBindings.prototype.extractFromEvery = function (index) {
        return this.bindings.map(function (b) { return b.remove(index); });
    };
    Object.defineProperty(SortablejsBindings.prototype, "provided", {
        get: function () {
            return !!this.bindings.length;
        },
        enumerable: true,
        configurable: true
    });
    return SortablejsBindings;
}());

var SortablejsService = /** @class */ (function () {
    function SortablejsService() {
    }
    SortablejsService.ɵfac = function SortablejsService_Factory(t) { return new (t || SortablejsService)(); };
    SortablejsService.ɵprov = ɵɵdefineInjectable({ token: SortablejsService, factory: SortablejsService.ɵfac, providedIn: 'root' });
    return SortablejsService;
}());
/*@__PURE__*/ (function () { ɵsetClassMetadata(SortablejsService, [{
        type: Injectable,
        args: [{
                providedIn: 'root',
            }]
    }], null, null); })();

var getIndexesFromEvent = function (event) {
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
var SortablejsDirective = /** @class */ (function () {
    function SortablejsDirective(globalConfig, service, element, zone, renderer) {
        this.globalConfig = globalConfig;
        this.service = service;
        this.element = element;
        this.zone = zone;
        this.renderer = renderer;
        this.runInsideAngular = false; // to be deprecated
        this.sortablejsInit = new EventEmitter();
    }
    SortablejsDirective.prototype.ngOnInit = function () {
        var _this = this;
        if (Sortable && Sortable.create) { // Sortable does not exist in angular universal (SSR)
            if (this.runInsideAngular) {
                this.create();
            }
            else {
                this.zone.runOutsideAngular(function () { return _this.create(); });
            }
        }
    };
    SortablejsDirective.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var optionsChange = changes.sortablejsOptions;
        if (optionsChange && !optionsChange.isFirstChange()) {
            var previousOptions_1 = optionsChange.previousValue;
            var currentOptions_1 = optionsChange.currentValue;
            Object.keys(currentOptions_1).forEach(function (optionName) {
                if (currentOptions_1[optionName] !== previousOptions_1[optionName]) {
                    // use low-level option setter
                    _this.sortableInstance.option(optionName, _this.options[optionName]);
                }
            });
        }
    };
    SortablejsDirective.prototype.ngOnDestroy = function () {
        if (this.sortableInstance) {
            this.sortableInstance.destroy();
        }
    };
    SortablejsDirective.prototype.create = function () {
        var _this = this;
        var container = this.sortablejsContainer ? this.element.nativeElement.querySelector(this.sortablejsContainer) : this.element.nativeElement;
        setTimeout(function () {
            _this.sortableInstance = Sortable.create(container, _this.options);
            _this.sortablejsInit.emit(_this.sortableInstance);
        }, 0);
    };
    SortablejsDirective.prototype.getBindings = function () {
        if (!this.sortablejs) {
            return new SortablejsBindings([]);
        }
        else if (this.sortablejs instanceof SortablejsBindings) {
            return this.sortablejs;
        }
        else {
            return new SortablejsBindings([this.sortablejs]);
        }
    };
    Object.defineProperty(SortablejsDirective.prototype, "options", {
        get: function () {
            return __assign(__assign({}, this.optionsWithoutEvents), this.overridenOptions);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SortablejsDirective.prototype, "optionsWithoutEvents", {
        get: function () {
            return __assign(__assign({}, (this.globalConfig || {})), (this.sortablejsOptions || {}));
        },
        enumerable: true,
        configurable: true
    });
    SortablejsDirective.prototype.proxyEvent = function (eventName) {
        var _this = this;
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.zone.run(function () {
            var _a;
            if (_this.optionsWithoutEvents && _this.optionsWithoutEvents[eventName]) {
                (_a = _this.optionsWithoutEvents)[eventName].apply(_a, __spread(params));
            }
        });
    };
    Object.defineProperty(SortablejsDirective.prototype, "isCloning", {
        get: function () {
            return this.sortableInstance.options.group.checkPull(this.sortableInstance, this.sortableInstance) === 'clone';
        },
        enumerable: true,
        configurable: true
    });
    SortablejsDirective.prototype.clone = function (item) {
        // by default pass the item through, no cloning performed
        return (this.sortablejsCloneFunction || (function (subitem) { return subitem; }))(item);
    };
    Object.defineProperty(SortablejsDirective.prototype, "overridenOptions", {
        get: function () {
            var _this = this;
            // always intercept standard events but act only in case items are set (bindingEnabled)
            // allows to forget about tracking this.items changes
            return {
                onAdd: function (event) {
                    _this.service.transfer = function (items) {
                        _this.getBindings().injectIntoEvery(event.newIndex, items);
                        _this.proxyEvent('onAdd', event);
                    };
                    _this.proxyEvent('onAddOriginal', event);
                },
                onRemove: function (event) {
                    var bindings = _this.getBindings();
                    if (bindings.provided) {
                        if (_this.isCloning) {
                            _this.service.transfer(bindings.getFromEvery(event.oldIndex).map(function (item) { return _this.clone(item); }));
                            // great thanks to https://github.com/tauu
                            // event.item is the original item from the source list which is moved to the target list
                            // event.clone is a clone of the original item and will be added to source list
                            // If bindings are provided, adding the item dom element to the target list causes artifacts
                            // as it interferes with the rendering performed by the angular template.
                            // Therefore we remove it immediately and also move the original item back to the source list.
                            // (event handler may be attached to the original item and not its clone, therefore keeping
                            // the original dom node, circumvents side effects )
                            _this.renderer.removeChild(event.item.parentNode, event.item);
                            _this.renderer.insertBefore(event.clone.parentNode, event.item, event.clone);
                            _this.renderer.removeChild(event.clone.parentNode, event.clone);
                        }
                        else {
                            _this.service.transfer(bindings.extractFromEvery(event.oldIndex));
                        }
                        _this.service.transfer = null;
                    }
                    _this.proxyEvent('onRemove', event);
                },
                onUpdate: function (event) {
                    var bindings = _this.getBindings();
                    var indexes = getIndexesFromEvent(event);
                    bindings.injectIntoEvery(indexes.new, bindings.extractFromEvery(indexes.old));
                    _this.proxyEvent('onUpdate', event);
                },
            };
        },
        enumerable: true,
        configurable: true
    });
    SortablejsDirective.ɵfac = function SortablejsDirective_Factory(t) { return new (t || SortablejsDirective)(ɵɵdirectiveInject(GLOBALS, 8), ɵɵdirectiveInject(SortablejsService), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone), ɵɵdirectiveInject(Renderer2)); };
    SortablejsDirective.ɵdir = ɵɵdefineDirective({ type: SortablejsDirective, selectors: [["", "sortablejs", ""]], inputs: { sortablejs: "sortablejs", sortablejsContainer: "sortablejsContainer", sortablejsOptions: "sortablejsOptions", sortablejsCloneFunction: "sortablejsCloneFunction", runInsideAngular: "runInsideAngular" }, outputs: { sortablejsInit: "sortablejsInit" }, features: [ɵɵNgOnChangesFeature] });
    return SortablejsDirective;
}());
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

var SortablejsModule = /** @class */ (function () {
    function SortablejsModule() {
    }
    SortablejsModule.forRoot = function (globalOptions) {
        return {
            ngModule: SortablejsModule,
            providers: [
                { provide: GLOBALS, useValue: globalOptions },
            ],
        };
    };
    SortablejsModule.ɵmod = ɵɵdefineNgModule({ type: SortablejsModule });
    SortablejsModule.ɵinj = ɵɵdefineInjector({ factory: function SortablejsModule_Factory(t) { return new (t || SortablejsModule)(); } });
    return SortablejsModule;
}());
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
