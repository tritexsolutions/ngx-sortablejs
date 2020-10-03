import { ElementRef, EventEmitter, NgZone, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChange } from '@angular/core';
import { SortablejsBindingTarget } from './sortablejs-binding-target';
import { SortablejsOptions } from './sortablejs-options';
import { SortablejsService } from './sortablejs.service';
import * as i0 from "@angular/core";
export declare class SortablejsDirective implements OnInit, OnChanges, OnDestroy {
    private globalConfig;
    private service;
    private element;
    private zone;
    private renderer;
    sortablejs: SortablejsBindingTarget;
    sortablejsContainer: string;
    sortablejsOptions: SortablejsOptions;
    sortablejsCloneFunction: <T>(item: T) => T;
    private sortableInstance;
    runInsideAngular: boolean;
    sortablejsInit: EventEmitter<any>;
    constructor(globalConfig: SortablejsOptions, service: SortablejsService, element: ElementRef, zone: NgZone, renderer: Renderer2);
    ngOnInit(): void;
    ngOnChanges(changes: {
        [prop in keyof SortablejsDirective]: SimpleChange;
    }): void;
    ngOnDestroy(): void;
    private create;
    private getBindings;
    private get options();
    private get optionsWithoutEvents();
    private proxyEvent;
    private get isCloning();
    private clone;
    private get overridenOptions();
    static ɵfac: i0.ɵɵFactoryDef<SortablejsDirective, [{ optional: true; }, null, null, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<SortablejsDirective, "[sortablejs]", never, { "sortablejs": "sortablejs"; "sortablejsContainer": "sortablejsContainer"; "sortablejsOptions": "sortablejsOptions"; "sortablejsCloneFunction": "sortablejsCloneFunction"; "runInsideAngular": "runInsideAngular"; }, { "sortablejsInit": "sortablejsInit"; }, never>;
}
