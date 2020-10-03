import { __assign, __read, __spread } from "tslib";
import { Directive, ElementRef, EventEmitter, Inject, Input, NgZone, Optional, Output, Renderer2 } from '@angular/core';
import Sortable from 'sortablejs';
import { GLOBALS } from './globals';
import { SortablejsBindings } from './sortablejs-bindings';
import { SortablejsService } from './sortablejs.service';
import * as i0 from "@angular/core";
import * as i1 from "./sortablejs.service";
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
    SortablejsDirective.ɵfac = function SortablejsDirective_Factory(t) { return new (t || SortablejsDirective)(i0.ɵɵdirectiveInject(GLOBALS, 8), i0.ɵɵdirectiveInject(i1.SortablejsService), i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i0.NgZone), i0.ɵɵdirectiveInject(i0.Renderer2)); };
    SortablejsDirective.ɵdir = i0.ɵɵdefineDirective({ type: SortablejsDirective, selectors: [["", "sortablejs", ""]], inputs: { sortablejs: "sortablejs", sortablejsContainer: "sortablejsContainer", sortablejsOptions: "sortablejsOptions", sortablejsCloneFunction: "sortablejsCloneFunction", runInsideAngular: "runInsideAngular" }, outputs: { sortablejsInit: "sortablejsInit" }, features: [i0.ɵɵNgOnChangesFeature] });
    return SortablejsDirective;
}());
export { SortablejsDirective };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydGFibGVqcy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtc29ydGFibGVqcy8iLCJzb3VyY2VzIjpbImxpYi9zb3J0YWJsZWpzLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFnQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBZ0IsTUFBTSxlQUFlLENBQUM7QUFDcEssT0FBTyxRQUFRLE1BQU0sWUFBWSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFcEMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFM0QsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7OztBQUV6RCxJQUFNLG1CQUFtQixHQUFHLFVBQUMsS0FBb0I7SUFDL0MsSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO1FBQ3hGLE9BQU87WUFDTCxHQUFHLEVBQUUsS0FBSyxDQUFDLGlCQUFpQjtZQUM1QixHQUFHLEVBQUUsS0FBSyxDQUFDLGlCQUFpQjtTQUM3QixDQUFDO0tBQ0w7U0FBTTtRQUNMLE9BQU87WUFDTCxHQUFHLEVBQUUsS0FBSyxDQUFDLFFBQVE7WUFDbkIsR0FBRyxFQUFFLEtBQUssQ0FBQyxRQUFRO1NBQ3BCLENBQUM7S0FDSDtBQUNILENBQUMsQ0FBQztBQUVGO0lBdUJFLDZCQUN1QyxZQUErQixFQUM1RCxPQUEwQixFQUMxQixPQUFtQixFQUNuQixJQUFZLEVBQ1osUUFBbUI7UUFKVSxpQkFBWSxHQUFaLFlBQVksQ0FBbUI7UUFDNUQsWUFBTyxHQUFQLE9BQU8sQ0FBbUI7UUFDMUIsWUFBTyxHQUFQLE9BQU8sQ0FB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NkJBQU07NEJBQ0wsS0FBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO3lCQUNsRTt3QkFFRCxLQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7cUJBQzlCO29CQUVELEtBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNyQyxDQUFDO2dCQUNELFFBQVEsRUFBRSxVQUFDLEtBQW9CO29CQUM3QixJQUFNLFFBQVEsR0FBRyxLQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQ3BDLElBQU0sT0FBTyxHQUFHLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUUzQyxRQUFRLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUM5RSxLQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDckMsQ0FBQzthQUNGLENBQUM7UUFDSixDQUFDOzs7T0FBQTswRkF2SlUsbUJBQW1CLHVCQXFCUixPQUFPOzREQXJCbEIsbUJBQW1COzhCQXpCaEM7Q0FrTEMsQUE1SkQsSUE0SkM7U0F6SlksbUJBQW1CO2tEQUFuQixtQkFBbUI7Y0FIL0IsU0FBUztlQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2FBQ3pCOztzQkFzQkksUUFBUTs7c0JBQUksTUFBTTt1QkFBQyxPQUFPOztrQkFuQjVCLEtBQUs7O2tCQUdMLEtBQUs7O2tCQUdMLEtBQUs7O2tCQUdMLEtBQUs7O2tCQUtMLEtBQUs7O2tCQUVMLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5qZWN0LCBJbnB1dCwgTmdab25lLCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBPcHRpb25hbCwgT3V0cHV0LCBSZW5kZXJlcjIsIFNpbXBsZUNoYW5nZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IFNvcnRhYmxlIGZyb20gJ3NvcnRhYmxlanMnO1xuaW1wb3J0IHsgR0xPQkFMUyB9IGZyb20gJy4vZ2xvYmFscyc7XG5pbXBvcnQgeyBTb3J0YWJsZWpzQmluZGluZ1RhcmdldCB9IGZyb20gJy4vc29ydGFibGVqcy1iaW5kaW5nLXRhcmdldCc7XG5pbXBvcnQgeyBTb3J0YWJsZWpzQmluZGluZ3MgfSBmcm9tICcuL3NvcnRhYmxlanMtYmluZGluZ3MnO1xuaW1wb3J0IHsgU29ydGFibGVqc09wdGlvbnMgfSBmcm9tICcuL3NvcnRhYmxlanMtb3B0aW9ucyc7XG5pbXBvcnQgeyBTb3J0YWJsZWpzU2VydmljZSB9IGZyb20gJy4vc29ydGFibGVqcy5zZXJ2aWNlJztcblxuY29uc3QgZ2V0SW5kZXhlc0Zyb21FdmVudCA9IChldmVudDogU29ydGFibGVFdmVudCkgPT4ge1xuICBpZiAoZXZlbnQuaGFzT3duUHJvcGVydHkoJ25ld0RyYWdnYWJsZUluZGV4JykgJiYgZXZlbnQuaGFzT3duUHJvcGVydHkoJ29sZERyYWdnYWJsZUluZGV4JykpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5ldzogZXZlbnQubmV3RHJhZ2dhYmxlSW5kZXgsXG4gICAgICAgIG9sZDogZXZlbnQub2xkRHJhZ2dhYmxlSW5kZXgsXG4gICAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBuZXc6IGV2ZW50Lm5ld0luZGV4LFxuICAgICAgb2xkOiBldmVudC5vbGRJbmRleCxcbiAgICB9O1xuICB9XG59O1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbc29ydGFibGVqc10nLFxufSlcbmV4cG9ydCBjbGFzcyBTb3J0YWJsZWpzRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG5cbiAgQElucHV0KClcbiAgc29ydGFibGVqczogU29ydGFibGVqc0JpbmRpbmdUYXJnZXQ7IC8vIGFycmF5IG9yIGEgRm9ybUFycmF5XG5cbiAgQElucHV0KClcbiAgc29ydGFibGVqc0NvbnRhaW5lcjogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIHNvcnRhYmxlanNPcHRpb25zOiBTb3J0YWJsZWpzT3B0aW9ucztcblxuICBASW5wdXQoKVxuICBzb3J0YWJsZWpzQ2xvbmVGdW5jdGlvbjogPFQ+KGl0ZW06IFQpID0+IFQ7XG5cbiAgcHJpdmF0ZSBzb3J0YWJsZUluc3RhbmNlOiBhbnk7XG5cbiAgQElucHV0KCkgcnVuSW5zaWRlQW5ndWxhciA9IGZhbHNlOyAvLyB0byBiZSBkZXByZWNhdGVkXG5cbiAgQE91dHB1dCgpIHNvcnRhYmxlanNJbml0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoR0xPQkFMUykgcHJpdmF0ZSBnbG9iYWxDb25maWc6IFNvcnRhYmxlanNPcHRpb25zLFxuICAgIHByaXZhdGUgc2VydmljZTogU29ydGFibGVqc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgem9uZTogTmdab25lLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAoU29ydGFibGUgJiYgU29ydGFibGUuY3JlYXRlKSB7IC8vIFNvcnRhYmxlIGRvZXMgbm90IGV4aXN0IGluIGFuZ3VsYXIgdW5pdmVyc2FsIChTU1IpXG4gICAgICBpZiAodGhpcy5ydW5JbnNpZGVBbmd1bGFyKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gdGhpcy5jcmVhdGUoKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogeyBbcHJvcCBpbiBrZXlvZiBTb3J0YWJsZWpzRGlyZWN0aXZlXTogU2ltcGxlQ2hhbmdlIH0pIHtcbiAgICBjb25zdCBvcHRpb25zQ2hhbmdlOiBTaW1wbGVDaGFuZ2UgPSBjaGFuZ2VzLnNvcnRhYmxlanNPcHRpb25zO1xuXG4gICAgaWYgKG9wdGlvbnNDaGFuZ2UgJiYgIW9wdGlvbnNDaGFuZ2UuaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICBjb25zdCBwcmV2aW91c09wdGlvbnM6IFNvcnRhYmxlanNPcHRpb25zID0gb3B0aW9uc0NoYW5nZS5wcmV2aW91c1ZhbHVlO1xuICAgICAgY29uc3QgY3VycmVudE9wdGlvbnM6IFNvcnRhYmxlanNPcHRpb25zID0gb3B0aW9uc0NoYW5nZS5jdXJyZW50VmFsdWU7XG5cbiAgICAgIE9iamVjdC5rZXlzKGN1cnJlbnRPcHRpb25zKS5mb3JFYWNoKG9wdGlvbk5hbWUgPT4ge1xuICAgICAgICBpZiAoY3VycmVudE9wdGlvbnNbb3B0aW9uTmFtZV0gIT09IHByZXZpb3VzT3B0aW9uc1tvcHRpb25OYW1lXSkge1xuICAgICAgICAgIC8vIHVzZSBsb3ctbGV2ZWwgb3B0aW9uIHNldHRlclxuICAgICAgICAgIHRoaXMuc29ydGFibGVJbnN0YW5jZS5vcHRpb24ob3B0aW9uTmFtZSwgdGhpcy5vcHRpb25zW29wdGlvbk5hbWVdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuc29ydGFibGVJbnN0YW5jZSkge1xuICAgICAgdGhpcy5zb3J0YWJsZUluc3RhbmNlLmRlc3Ryb3koKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZSgpIHtcbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLnNvcnRhYmxlanNDb250YWluZXIgPyB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuc29ydGFibGVqc0NvbnRhaW5lcikgOiB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudDtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zb3J0YWJsZUluc3RhbmNlID0gU29ydGFibGUuY3JlYXRlKGNvbnRhaW5lciwgdGhpcy5vcHRpb25zKTtcbiAgICAgIHRoaXMuc29ydGFibGVqc0luaXQuZW1pdCh0aGlzLnNvcnRhYmxlSW5zdGFuY2UpO1xuICAgIH0sIDApO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRCaW5kaW5ncygpOiBTb3J0YWJsZWpzQmluZGluZ3Mge1xuICAgIGlmICghdGhpcy5zb3J0YWJsZWpzKSB7XG4gICAgICByZXR1cm4gbmV3IFNvcnRhYmxlanNCaW5kaW5ncyhbXSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnNvcnRhYmxlanMgaW5zdGFuY2VvZiBTb3J0YWJsZWpzQmluZGluZ3MpIHtcbiAgICAgIHJldHVybiB0aGlzLnNvcnRhYmxlanM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgU29ydGFibGVqc0JpbmRpbmdzKFt0aGlzLnNvcnRhYmxlanNdKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldCBvcHRpb25zKCkge1xuICAgIHJldHVybiB7IC4uLnRoaXMub3B0aW9uc1dpdGhvdXRFdmVudHMsIC4uLnRoaXMub3ZlcnJpZGVuT3B0aW9ucyB9O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgb3B0aW9uc1dpdGhvdXRFdmVudHMoKSB7XG4gICAgcmV0dXJuIHsgLi4uKHRoaXMuZ2xvYmFsQ29uZmlnIHx8IHt9KSwgLi4uKHRoaXMuc29ydGFibGVqc09wdGlvbnMgfHwge30pIH07XG4gIH1cblxuICBwcml2YXRlIHByb3h5RXZlbnQoZXZlbnROYW1lOiBzdHJpbmcsIC4uLnBhcmFtczogYW55W10pIHtcbiAgICB0aGlzLnpvbmUucnVuKCgpID0+IHsgLy8gcmUtZW50ZXJpbmcgem9uZSwgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9Tb3J0YWJsZUpTL2FuZ3VsYXItc29ydGFibGVqcy9pc3N1ZXMvMTEwI2lzc3VlY29tbWVudC00MDg4NzQ2MDBcbiAgICAgIGlmICh0aGlzLm9wdGlvbnNXaXRob3V0RXZlbnRzICYmIHRoaXMub3B0aW9uc1dpdGhvdXRFdmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgICB0aGlzLm9wdGlvbnNXaXRob3V0RXZlbnRzW2V2ZW50TmFtZV0oLi4ucGFyYW1zKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IGlzQ2xvbmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5zb3J0YWJsZUluc3RhbmNlLm9wdGlvbnMuZ3JvdXAuY2hlY2tQdWxsKHRoaXMuc29ydGFibGVJbnN0YW5jZSwgdGhpcy5zb3J0YWJsZUluc3RhbmNlKSA9PT0gJ2Nsb25lJztcbiAgfVxuXG4gIHByaXZhdGUgY2xvbmU8VD4oaXRlbTogVCk6IFQge1xuICAgIC8vIGJ5IGRlZmF1bHQgcGFzcyB0aGUgaXRlbSB0aHJvdWdoLCBubyBjbG9uaW5nIHBlcmZvcm1lZFxuICAgIHJldHVybiAodGhpcy5zb3J0YWJsZWpzQ2xvbmVGdW5jdGlvbiB8fCAoc3ViaXRlbSA9PiBzdWJpdGVtKSkoaXRlbSk7XG4gIH1cblxuICBwcml2YXRlIGdldCBvdmVycmlkZW5PcHRpb25zKCk6IFNvcnRhYmxlanNPcHRpb25zIHtcbiAgICAvLyBhbHdheXMgaW50ZXJjZXB0IHN0YW5kYXJkIGV2ZW50cyBidXQgYWN0IG9ubHkgaW4gY2FzZSBpdGVtcyBhcmUgc2V0IChiaW5kaW5nRW5hYmxlZClcbiAgICAvLyBhbGxvd3MgdG8gZm9yZ2V0IGFib3V0IHRyYWNraW5nIHRoaXMuaXRlbXMgY2hhbmdlc1xuICAgIHJldHVybiB7XG4gICAgICBvbkFkZDogKGV2ZW50OiBTb3J0YWJsZUV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuc2VydmljZS50cmFuc2ZlciA9IChpdGVtczogYW55W10pID0+IHtcbiAgICAgICAgICB0aGlzLmdldEJpbmRpbmdzKCkuaW5qZWN0SW50b0V2ZXJ5KGV2ZW50Lm5ld0luZGV4LCBpdGVtcyk7XG4gICAgICAgICAgdGhpcy5wcm94eUV2ZW50KCdvbkFkZCcsIGV2ZW50KTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnByb3h5RXZlbnQoJ29uQWRkT3JpZ2luYWwnLCBldmVudCk7XG4gICAgICB9LFxuICAgICAgb25SZW1vdmU6IChldmVudDogU29ydGFibGVFdmVudCkgPT4ge1xuICAgICAgICBjb25zdCBiaW5kaW5ncyA9IHRoaXMuZ2V0QmluZGluZ3MoKTtcblxuICAgICAgICBpZiAoYmluZGluZ3MucHJvdmlkZWQpIHtcbiAgICAgICAgICBpZiAodGhpcy5pc0Nsb25pbmcpIHtcbiAgICAgICAgICAgIHRoaXMuc2VydmljZS50cmFuc2ZlcihiaW5kaW5ncy5nZXRGcm9tRXZlcnkoZXZlbnQub2xkSW5kZXgpLm1hcChpdGVtID0+IHRoaXMuY2xvbmUoaXRlbSkpKTtcblxuICAgICAgICAgICAgLy8gZ3JlYXQgdGhhbmtzIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS90YXV1XG4gICAgICAgICAgICAvLyBldmVudC5pdGVtIGlzIHRoZSBvcmlnaW5hbCBpdGVtIGZyb20gdGhlIHNvdXJjZSBsaXN0IHdoaWNoIGlzIG1vdmVkIHRvIHRoZSB0YXJnZXQgbGlzdFxuICAgICAgICAgICAgLy8gZXZlbnQuY2xvbmUgaXMgYSBjbG9uZSBvZiB0aGUgb3JpZ2luYWwgaXRlbSBhbmQgd2lsbCBiZSBhZGRlZCB0byBzb3VyY2UgbGlzdFxuICAgICAgICAgICAgLy8gSWYgYmluZGluZ3MgYXJlIHByb3ZpZGVkLCBhZGRpbmcgdGhlIGl0ZW0gZG9tIGVsZW1lbnQgdG8gdGhlIHRhcmdldCBsaXN0IGNhdXNlcyBhcnRpZmFjdHNcbiAgICAgICAgICAgIC8vIGFzIGl0IGludGVyZmVyZXMgd2l0aCB0aGUgcmVuZGVyaW5nIHBlcmZvcm1lZCBieSB0aGUgYW5ndWxhciB0ZW1wbGF0ZS5cbiAgICAgICAgICAgIC8vIFRoZXJlZm9yZSB3ZSByZW1vdmUgaXQgaW1tZWRpYXRlbHkgYW5kIGFsc28gbW92ZSB0aGUgb3JpZ2luYWwgaXRlbSBiYWNrIHRvIHRoZSBzb3VyY2UgbGlzdC5cbiAgICAgICAgICAgIC8vIChldmVudCBoYW5kbGVyIG1heSBiZSBhdHRhY2hlZCB0byB0aGUgb3JpZ2luYWwgaXRlbSBhbmQgbm90IGl0cyBjbG9uZSwgdGhlcmVmb3JlIGtlZXBpbmdcbiAgICAgICAgICAgIC8vIHRoZSBvcmlnaW5hbCBkb20gbm9kZSwgY2lyY3VtdmVudHMgc2lkZSBlZmZlY3RzIClcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2hpbGQoZXZlbnQuaXRlbS5wYXJlbnROb2RlLCBldmVudC5pdGVtKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuaW5zZXJ0QmVmb3JlKGV2ZW50LmNsb25lLnBhcmVudE5vZGUsIGV2ZW50Lml0ZW0sIGV2ZW50LmNsb25lKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2hpbGQoZXZlbnQuY2xvbmUucGFyZW50Tm9kZSwgZXZlbnQuY2xvbmUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNlcnZpY2UudHJhbnNmZXIoYmluZGluZ3MuZXh0cmFjdEZyb21FdmVyeShldmVudC5vbGRJbmRleCkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuc2VydmljZS50cmFuc2ZlciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnByb3h5RXZlbnQoJ29uUmVtb3ZlJywgZXZlbnQpO1xuICAgICAgfSxcbiAgICAgIG9uVXBkYXRlOiAoZXZlbnQ6IFNvcnRhYmxlRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgYmluZGluZ3MgPSB0aGlzLmdldEJpbmRpbmdzKCk7XG4gICAgICAgIGNvbnN0IGluZGV4ZXMgPSBnZXRJbmRleGVzRnJvbUV2ZW50KGV2ZW50KTtcblxuICAgICAgICBiaW5kaW5ncy5pbmplY3RJbnRvRXZlcnkoaW5kZXhlcy5uZXcsIGJpbmRpbmdzLmV4dHJhY3RGcm9tRXZlcnkoaW5kZXhlcy5vbGQpKTtcbiAgICAgICAgdGhpcy5wcm94eUV2ZW50KCdvblVwZGF0ZScsIGV2ZW50KTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG59XG5cbmludGVyZmFjZSBTb3J0YWJsZUV2ZW50IHtcbiAgb2xkSW5kZXg6IG51bWJlcjtcbiAgbmV3SW5kZXg6IG51bWJlcjtcbiAgb2xkRHJhZ2dhYmxlSW5kZXg/OiBudW1iZXI7XG4gIG5ld0RyYWdnYWJsZUluZGV4PzogbnVtYmVyO1xuICBpdGVtOiBIVE1MRWxlbWVudDtcbiAgY2xvbmU6IEhUTUxFbGVtZW50O1xufVxuIl19