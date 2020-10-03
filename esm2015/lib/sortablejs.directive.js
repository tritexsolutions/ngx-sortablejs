import { Directive, ElementRef, EventEmitter, Inject, Input, NgZone, Optional, Output, Renderer2 } from '@angular/core';
import Sortable from 'sortablejs';
import { GLOBALS } from './globals';
import { SortablejsBindings } from './sortablejs-bindings';
import { SortablejsService } from './sortablejs.service';
import * as i0 from "@angular/core";
import * as i1 from "./sortablejs.service";
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
export class SortablejsDirective {
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
SortablejsDirective.ɵfac = function SortablejsDirective_Factory(t) { return new (t || SortablejsDirective)(i0.ɵɵdirectiveInject(GLOBALS, 8), i0.ɵɵdirectiveInject(i1.SortablejsService), i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i0.NgZone), i0.ɵɵdirectiveInject(i0.Renderer2)); };
SortablejsDirective.ɵdir = i0.ɵɵdefineDirective({ type: SortablejsDirective, selectors: [["", "sortablejs", ""]], inputs: { sortablejs: "sortablejs", sortablejsContainer: "sortablejsContainer", sortablejsOptions: "sortablejsOptions", sortablejsCloneFunction: "sortablejsCloneFunction", runInsideAngular: "runInsideAngular" }, outputs: { sortablejsInit: "sortablejsInit" }, features: [i0.ɵɵNgOnChangesFeature] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(SortablejsDirective, [{
        type: Directive,
        args: [{
                selector: '[sortablejs]',
            }]
    }], function () { return [{ type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [GLOBALS]
            }] }, { type: i1.SortablejsService }, { type: i0.ElementRef }, { type: i0.NgZone }, { type: i0.Renderer2 }]; }, { sortablejs: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydGFibGVqcy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtc29ydGFibGVqcy8iLCJzb3VyY2VzIjpbImxpYi9zb3J0YWJsZWpzLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQWdDLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFnQixNQUFNLGVBQWUsQ0FBQztBQUNwSyxPQUFPLFFBQVEsTUFBTSxZQUFZLENBQUM7QUFDbEMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUVwQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUUzRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7O0FBRXpELE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxLQUFvQixFQUFFLEVBQUU7SUFDbkQsSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO1FBQ3hGLE9BQU87WUFDTCxHQUFHLEVBQUUsS0FBSyxDQUFDLGlCQUFpQjtZQUM1QixHQUFHLEVBQUUsS0FBSyxDQUFDLGlCQUFpQjtTQUM3QixDQUFDO0tBQ0w7U0FBTTtRQUNMLE9BQU87WUFDTCxHQUFHLEVBQUUsS0FBSyxDQUFDLFFBQVE7WUFDbkIsR0FBRyxFQUFFLEtBQUssQ0FBQyxRQUFRO1NBQ3BCLENBQUM7S0FDSDtBQUNILENBQUMsQ0FBQztBQUtGLE1BQU0sT0FBTyxtQkFBbUI7SUFvQjlCLFlBQ3VDLFlBQStCLEVBQzVELE9BQTBCLEVBQzFCLE9BQW1CLEVBQ25CLElBQVksRUFDWixRQUFtQjtRQUpVLGlCQUFZLEdBQVosWUFBWSxDQUFtQjtRQUM1RCxZQUFPLEdBQVAsT0FBTyxDQUFt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LElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3JDLENBQUM7WUFDRCxRQUFRLEVBQUUsQ0FBQyxLQUFvQixFQUFFLEVBQUU7Z0JBQ2pDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDcEMsTUFBTSxPQUFPLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBRTNDLFFBQVEsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzlFLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3JDLENBQUM7U0FDRixDQUFDO0lBQ0osQ0FBQzs7c0ZBdkpVLG1CQUFtQix1QkFxQlIsT0FBTzt3REFyQmxCLG1CQUFtQjtrREFBbkIsbUJBQW1CO2NBSC9CLFNBQVM7ZUFBQztnQkFDVCxRQUFRLEVBQUUsY0FBYzthQUN6Qjs7c0JBc0JJLFFBQVE7O3NCQUFJLE1BQU07dUJBQUMsT0FBTzs7a0JBbkI1QixLQUFLOztrQkFHTCxLQUFLOztrQkFHTCxLQUFLOztrQkFHTCxLQUFLOztrQkFLTCxLQUFLOztrQkFFTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIEluamVjdCwgSW5wdXQsIE5nWm9uZSwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3B0aW9uYWwsIE91dHB1dCwgUmVuZGVyZXIyLCBTaW1wbGVDaGFuZ2UgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCBTb3J0YWJsZSBmcm9tICdzb3J0YWJsZWpzJztcbmltcG9ydCB7IEdMT0JBTFMgfSBmcm9tICcuL2dsb2JhbHMnO1xuaW1wb3J0IHsgU29ydGFibGVqc0JpbmRpbmdUYXJnZXQgfSBmcm9tICcuL3NvcnRhYmxlanMtYmluZGluZy10YXJnZXQnO1xuaW1wb3J0IHsgU29ydGFibGVqc0JpbmRpbmdzIH0gZnJvbSAnLi9zb3J0YWJsZWpzLWJpbmRpbmdzJztcbmltcG9ydCB7IFNvcnRhYmxlanNPcHRpb25zIH0gZnJvbSAnLi9zb3J0YWJsZWpzLW9wdGlvbnMnO1xuaW1wb3J0IHsgU29ydGFibGVqc1NlcnZpY2UgfSBmcm9tICcuL3NvcnRhYmxlanMuc2VydmljZSc7XG5cbmNvbnN0IGdldEluZGV4ZXNGcm9tRXZlbnQgPSAoZXZlbnQ6IFNvcnRhYmxlRXZlbnQpID0+IHtcbiAgaWYgKGV2ZW50Lmhhc093blByb3BlcnR5KCduZXdEcmFnZ2FibGVJbmRleCcpICYmIGV2ZW50Lmhhc093blByb3BlcnR5KCdvbGREcmFnZ2FibGVJbmRleCcpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuZXc6IGV2ZW50Lm5ld0RyYWdnYWJsZUluZGV4LFxuICAgICAgICBvbGQ6IGV2ZW50Lm9sZERyYWdnYWJsZUluZGV4LFxuICAgICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmV3OiBldmVudC5uZXdJbmRleCxcbiAgICAgIG9sZDogZXZlbnQub2xkSW5kZXgsXG4gICAgfTtcbiAgfVxufTtcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3NvcnRhYmxlanNdJyxcbn0pXG5leHBvcnQgY2xhc3MgU29ydGFibGVqc0RpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuXG4gIEBJbnB1dCgpXG4gIHNvcnRhYmxlanM6IFNvcnRhYmxlanNCaW5kaW5nVGFyZ2V0OyAvLyBhcnJheSBvciBhIEZvcm1BcnJheVxuXG4gIEBJbnB1dCgpXG4gIHNvcnRhYmxlanNDb250YWluZXI6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBzb3J0YWJsZWpzT3B0aW9uczogU29ydGFibGVqc09wdGlvbnM7XG5cbiAgQElucHV0KClcbiAgc29ydGFibGVqc0Nsb25lRnVuY3Rpb246IDxUPihpdGVtOiBUKSA9PiBUO1xuXG4gIHByaXZhdGUgc29ydGFibGVJbnN0YW5jZTogYW55O1xuXG4gIEBJbnB1dCgpIHJ1bkluc2lkZUFuZ3VsYXIgPSBmYWxzZTsgLy8gdG8gYmUgZGVwcmVjYXRlZFxuXG4gIEBPdXRwdXQoKSBzb3J0YWJsZWpzSW5pdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEdMT0JBTFMpIHByaXZhdGUgZ2xvYmFsQ29uZmlnOiBTb3J0YWJsZWpzT3B0aW9ucyxcbiAgICBwcml2YXRlIHNlcnZpY2U6IFNvcnRhYmxlanNTZXJ2aWNlLFxuICAgIHByaXZhdGUgZWxlbWVudDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKFNvcnRhYmxlICYmIFNvcnRhYmxlLmNyZWF0ZSkgeyAvLyBTb3J0YWJsZSBkb2VzIG5vdCBleGlzdCBpbiBhbmd1bGFyIHVuaXZlcnNhbCAoU1NSKVxuICAgICAgaWYgKHRoaXMucnVuSW5zaWRlQW5ndWxhcikge1xuICAgICAgICB0aGlzLmNyZWF0ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHRoaXMuY3JlYXRlKCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IHsgW3Byb3AgaW4ga2V5b2YgU29ydGFibGVqc0RpcmVjdGl2ZV06IFNpbXBsZUNoYW5nZSB9KSB7XG4gICAgY29uc3Qgb3B0aW9uc0NoYW5nZTogU2ltcGxlQ2hhbmdlID0gY2hhbmdlcy5zb3J0YWJsZWpzT3B0aW9ucztcblxuICAgIGlmIChvcHRpb25zQ2hhbmdlICYmICFvcHRpb25zQ2hhbmdlLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgY29uc3QgcHJldmlvdXNPcHRpb25zOiBTb3J0YWJsZWpzT3B0aW9ucyA9IG9wdGlvbnNDaGFuZ2UucHJldmlvdXNWYWx1ZTtcbiAgICAgIGNvbnN0IGN1cnJlbnRPcHRpb25zOiBTb3J0YWJsZWpzT3B0aW9ucyA9IG9wdGlvbnNDaGFuZ2UuY3VycmVudFZhbHVlO1xuXG4gICAgICBPYmplY3Qua2V5cyhjdXJyZW50T3B0aW9ucykuZm9yRWFjaChvcHRpb25OYW1lID0+IHtcbiAgICAgICAgaWYgKGN1cnJlbnRPcHRpb25zW29wdGlvbk5hbWVdICE9PSBwcmV2aW91c09wdGlvbnNbb3B0aW9uTmFtZV0pIHtcbiAgICAgICAgICAvLyB1c2UgbG93LWxldmVsIG9wdGlvbiBzZXR0ZXJcbiAgICAgICAgICB0aGlzLnNvcnRhYmxlSW5zdGFuY2Uub3B0aW9uKG9wdGlvbk5hbWUsIHRoaXMub3B0aW9uc1tvcHRpb25OYW1lXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnNvcnRhYmxlSW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuc29ydGFibGVJbnN0YW5jZS5kZXN0cm95KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGUoKSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5zb3J0YWJsZWpzQ29udGFpbmVyID8gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnNvcnRhYmxlanNDb250YWluZXIpIDogdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc29ydGFibGVJbnN0YW5jZSA9IFNvcnRhYmxlLmNyZWF0ZShjb250YWluZXIsIHRoaXMub3B0aW9ucyk7XG4gICAgICB0aGlzLnNvcnRhYmxlanNJbml0LmVtaXQodGhpcy5zb3J0YWJsZUluc3RhbmNlKTtcbiAgICB9LCAwKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0QmluZGluZ3MoKTogU29ydGFibGVqc0JpbmRpbmdzIHtcbiAgICBpZiAoIXRoaXMuc29ydGFibGVqcykge1xuICAgICAgcmV0dXJuIG5ldyBTb3J0YWJsZWpzQmluZGluZ3MoW10pO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zb3J0YWJsZWpzIGluc3RhbmNlb2YgU29ydGFibGVqc0JpbmRpbmdzKSB7XG4gICAgICByZXR1cm4gdGhpcy5zb3J0YWJsZWpzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IFNvcnRhYmxlanNCaW5kaW5ncyhbdGhpcy5zb3J0YWJsZWpzXSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXQgb3B0aW9ucygpIHtcbiAgICByZXR1cm4geyAuLi50aGlzLm9wdGlvbnNXaXRob3V0RXZlbnRzLCAuLi50aGlzLm92ZXJyaWRlbk9wdGlvbnMgfTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IG9wdGlvbnNXaXRob3V0RXZlbnRzKCkge1xuICAgIHJldHVybiB7IC4uLih0aGlzLmdsb2JhbENvbmZpZyB8fCB7fSksIC4uLih0aGlzLnNvcnRhYmxlanNPcHRpb25zIHx8IHt9KSB9O1xuICB9XG5cbiAgcHJpdmF0ZSBwcm94eUV2ZW50KGV2ZW50TmFtZTogc3RyaW5nLCAuLi5wYXJhbXM6IGFueVtdKSB7XG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB7IC8vIHJlLWVudGVyaW5nIHpvbmUsIHNlZSBodHRwczovL2dpdGh1Yi5jb20vU29ydGFibGVKUy9hbmd1bGFyLXNvcnRhYmxlanMvaXNzdWVzLzExMCNpc3N1ZWNvbW1lbnQtNDA4ODc0NjAwXG4gICAgICBpZiAodGhpcy5vcHRpb25zV2l0aG91dEV2ZW50cyAmJiB0aGlzLm9wdGlvbnNXaXRob3V0RXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgdGhpcy5vcHRpb25zV2l0aG91dEV2ZW50c1tldmVudE5hbWVdKC4uLnBhcmFtcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGdldCBpc0Nsb25pbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuc29ydGFibGVJbnN0YW5jZS5vcHRpb25zLmdyb3VwLmNoZWNrUHVsbCh0aGlzLnNvcnRhYmxlSW5zdGFuY2UsIHRoaXMuc29ydGFibGVJbnN0YW5jZSkgPT09ICdjbG9uZSc7XG4gIH1cblxuICBwcml2YXRlIGNsb25lPFQ+KGl0ZW06IFQpOiBUIHtcbiAgICAvLyBieSBkZWZhdWx0IHBhc3MgdGhlIGl0ZW0gdGhyb3VnaCwgbm8gY2xvbmluZyBwZXJmb3JtZWRcbiAgICByZXR1cm4gKHRoaXMuc29ydGFibGVqc0Nsb25lRnVuY3Rpb24gfHwgKHN1Yml0ZW0gPT4gc3ViaXRlbSkpKGl0ZW0pO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgb3ZlcnJpZGVuT3B0aW9ucygpOiBTb3J0YWJsZWpzT3B0aW9ucyB7XG4gICAgLy8gYWx3YXlzIGludGVyY2VwdCBzdGFuZGFyZCBldmVudHMgYnV0IGFjdCBvbmx5IGluIGNhc2UgaXRlbXMgYXJlIHNldCAoYmluZGluZ0VuYWJsZWQpXG4gICAgLy8gYWxsb3dzIHRvIGZvcmdldCBhYm91dCB0cmFja2luZyB0aGlzLml0ZW1zIGNoYW5nZXNcbiAgICByZXR1cm4ge1xuICAgICAgb25BZGQ6IChldmVudDogU29ydGFibGVFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLnNlcnZpY2UudHJhbnNmZXIgPSAoaXRlbXM6IGFueVtdKSA9PiB7XG4gICAgICAgICAgdGhpcy5nZXRCaW5kaW5ncygpLmluamVjdEludG9FdmVyeShldmVudC5uZXdJbmRleCwgaXRlbXMpO1xuICAgICAgICAgIHRoaXMucHJveHlFdmVudCgnb25BZGQnLCBldmVudCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5wcm94eUV2ZW50KCdvbkFkZE9yaWdpbmFsJywgZXZlbnQpO1xuICAgICAgfSxcbiAgICAgIG9uUmVtb3ZlOiAoZXZlbnQ6IFNvcnRhYmxlRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgYmluZGluZ3MgPSB0aGlzLmdldEJpbmRpbmdzKCk7XG5cbiAgICAgICAgaWYgKGJpbmRpbmdzLnByb3ZpZGVkKSB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNDbG9uaW5nKSB7XG4gICAgICAgICAgICB0aGlzLnNlcnZpY2UudHJhbnNmZXIoYmluZGluZ3MuZ2V0RnJvbUV2ZXJ5KGV2ZW50Lm9sZEluZGV4KS5tYXAoaXRlbSA9PiB0aGlzLmNsb25lKGl0ZW0pKSk7XG5cbiAgICAgICAgICAgIC8vIGdyZWF0IHRoYW5rcyB0byBodHRwczovL2dpdGh1Yi5jb20vdGF1dVxuICAgICAgICAgICAgLy8gZXZlbnQuaXRlbSBpcyB0aGUgb3JpZ2luYWwgaXRlbSBmcm9tIHRoZSBzb3VyY2UgbGlzdCB3aGljaCBpcyBtb3ZlZCB0byB0aGUgdGFyZ2V0IGxpc3RcbiAgICAgICAgICAgIC8vIGV2ZW50LmNsb25lIGlzIGEgY2xvbmUgb2YgdGhlIG9yaWdpbmFsIGl0ZW0gYW5kIHdpbGwgYmUgYWRkZWQgdG8gc291cmNlIGxpc3RcbiAgICAgICAgICAgIC8vIElmIGJpbmRpbmdzIGFyZSBwcm92aWRlZCwgYWRkaW5nIHRoZSBpdGVtIGRvbSBlbGVtZW50IHRvIHRoZSB0YXJnZXQgbGlzdCBjYXVzZXMgYXJ0aWZhY3RzXG4gICAgICAgICAgICAvLyBhcyBpdCBpbnRlcmZlcmVzIHdpdGggdGhlIHJlbmRlcmluZyBwZXJmb3JtZWQgYnkgdGhlIGFuZ3VsYXIgdGVtcGxhdGUuXG4gICAgICAgICAgICAvLyBUaGVyZWZvcmUgd2UgcmVtb3ZlIGl0IGltbWVkaWF0ZWx5IGFuZCBhbHNvIG1vdmUgdGhlIG9yaWdpbmFsIGl0ZW0gYmFjayB0byB0aGUgc291cmNlIGxpc3QuXG4gICAgICAgICAgICAvLyAoZXZlbnQgaGFuZGxlciBtYXkgYmUgYXR0YWNoZWQgdG8gdGhlIG9yaWdpbmFsIGl0ZW0gYW5kIG5vdCBpdHMgY2xvbmUsIHRoZXJlZm9yZSBrZWVwaW5nXG4gICAgICAgICAgICAvLyB0aGUgb3JpZ2luYWwgZG9tIG5vZGUsIGNpcmN1bXZlbnRzIHNpZGUgZWZmZWN0cyApXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNoaWxkKGV2ZW50Lml0ZW0ucGFyZW50Tm9kZSwgZXZlbnQuaXRlbSk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmluc2VydEJlZm9yZShldmVudC5jbG9uZS5wYXJlbnROb2RlLCBldmVudC5pdGVtLCBldmVudC5jbG9uZSk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNoaWxkKGV2ZW50LmNsb25lLnBhcmVudE5vZGUsIGV2ZW50LmNsb25lKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXJ2aWNlLnRyYW5zZmVyKGJpbmRpbmdzLmV4dHJhY3RGcm9tRXZlcnkoZXZlbnQub2xkSW5kZXgpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnNlcnZpY2UudHJhbnNmZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wcm94eUV2ZW50KCdvblJlbW92ZScsIGV2ZW50KTtcbiAgICAgIH0sXG4gICAgICBvblVwZGF0ZTogKGV2ZW50OiBTb3J0YWJsZUV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGJpbmRpbmdzID0gdGhpcy5nZXRCaW5kaW5ncygpO1xuICAgICAgICBjb25zdCBpbmRleGVzID0gZ2V0SW5kZXhlc0Zyb21FdmVudChldmVudCk7XG5cbiAgICAgICAgYmluZGluZ3MuaW5qZWN0SW50b0V2ZXJ5KGluZGV4ZXMubmV3LCBiaW5kaW5ncy5leHRyYWN0RnJvbUV2ZXJ5KGluZGV4ZXMub2xkKSk7XG4gICAgICAgIHRoaXMucHJveHlFdmVudCgnb25VcGRhdGUnLCBldmVudCk7XG4gICAgICB9LFxuICAgIH07XG4gIH1cblxufVxuXG5pbnRlcmZhY2UgU29ydGFibGVFdmVudCB7XG4gIG9sZEluZGV4OiBudW1iZXI7XG4gIG5ld0luZGV4OiBudW1iZXI7XG4gIG9sZERyYWdnYWJsZUluZGV4PzogbnVtYmVyO1xuICBuZXdEcmFnZ2FibGVJbmRleD86IG51bWJlcjtcbiAgaXRlbTogSFRNTEVsZW1lbnQ7XG4gIGNsb25lOiBIVE1MRWxlbWVudDtcbn1cbiJdfQ==