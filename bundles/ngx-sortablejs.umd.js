(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('sortablejs')) :
    typeof define === 'function' && define.amd ? define('ngx-sortablejs', ['exports', '@angular/core', 'sortablejs'], factory) :
    (global = global || self, factory(global['ngx-sortablejs'] = {}, global.ng.core, global.Sortable));
}(this, (function (exports, core, Sortable) { 'use strict';

    Sortable = Sortable && Object.prototype.hasOwnProperty.call(Sortable, 'default') ? Sortable['default'] : Sortable;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    var GLOBALS = new core.InjectionToken('Global config for sortablejs');

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
        SortablejsService.ɵprov = core.ɵɵdefineInjectable({ token: SortablejsService, factory: SortablejsService.ɵfac, providedIn: 'root' });
        return SortablejsService;
    }());
    /*@__PURE__*/ (function () { core.ɵsetClassMetadata(SortablejsService, [{
            type: core.Injectable,
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
            this.sortablejsInit = new core.EventEmitter();
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
        SortablejsDirective.ɵfac = function SortablejsDirective_Factory(t) { return new (t || SortablejsDirective)(core.ɵɵdirectiveInject(GLOBALS, 8), core.ɵɵdirectiveInject(SortablejsService), core.ɵɵdirectiveInject(core.ElementRef), core.ɵɵdirectiveInject(core.NgZone), core.ɵɵdirectiveInject(core.Renderer2)); };
        SortablejsDirective.ɵdir = core.ɵɵdefineDirective({ type: SortablejsDirective, selectors: [["", "sortablejs", ""]], inputs: { sortablejs: "sortablejs", sortablejsContainer: "sortablejsContainer", sortablejsOptions: "sortablejsOptions", sortablejsCloneFunction: "sortablejsCloneFunction", runInsideAngular: "runInsideAngular" }, outputs: { sortablejsInit: "sortablejsInit" }, features: [core.ɵɵNgOnChangesFeature] });
        return SortablejsDirective;
    }());
    /*@__PURE__*/ (function () { core.ɵsetClassMetadata(SortablejsDirective, [{
            type: core.Directive,
            args: [{
                    selector: '[sortablejs]',
                }]
        }], function () { return [{ type: undefined, decorators: [{
                    type: core.Optional
                }, {
                    type: core.Inject,
                    args: [GLOBALS]
                }] }, { type: SortablejsService }, { type: core.ElementRef }, { type: core.NgZone }, { type: core.Renderer2 }]; }, { sortablejs: [{
                type: core.Input
            }], sortablejsContainer: [{
                type: core.Input
            }], sortablejsOptions: [{
                type: core.Input
            }], sortablejsCloneFunction: [{
                type: core.Input
            }], runInsideAngular: [{
                type: core.Input
            }], sortablejsInit: [{
                type: core.Output
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
        SortablejsModule.ɵmod = core.ɵɵdefineNgModule({ type: SortablejsModule });
        SortablejsModule.ɵinj = core.ɵɵdefineInjector({ factory: function SortablejsModule_Factory(t) { return new (t || SortablejsModule)(); } });
        return SortablejsModule;
    }());
    (function () { (typeof ngJitMode === "undefined" || ngJitMode) && core.ɵɵsetNgModuleScope(SortablejsModule, { declarations: [SortablejsDirective], exports: [SortablejsDirective] }); })();
    /*@__PURE__*/ (function () { core.ɵsetClassMetadata(SortablejsModule, [{
            type: core.NgModule,
            args: [{
                    declarations: [SortablejsDirective],
                    exports: [SortablejsDirective],
                }]
        }], null, null); })();

    exports.SortablejsDirective = SortablejsDirective;
    exports.SortablejsModule = SortablejsModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-sortablejs.umd.js.map
