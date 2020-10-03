import { NgModule } from '@angular/core';
import { GLOBALS } from './globals';
import { SortablejsDirective } from './sortablejs.directive';
import * as i0 from "@angular/core";
export class SortablejsModule {
    static forRoot(globalOptions) {
        return {
            ngModule: SortablejsModule,
            providers: [
                { provide: GLOBALS, useValue: globalOptions },
            ],
        };
    }
}
SortablejsModule.ɵmod = i0.ɵɵdefineNgModule({ type: SortablejsModule });
SortablejsModule.ɵinj = i0.ɵɵdefineInjector({ factory: function SortablejsModule_Factory(t) { return new (t || SortablejsModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(SortablejsModule, { declarations: [SortablejsDirective], exports: [SortablejsDirective] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(SortablejsModule, [{
        type: NgModule,
        args: [{
                declarations: [SortablejsDirective],
                exports: [SortablejsDirective],
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydGFibGVqcy5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtc29ydGFibGVqcy8iLCJzb3VyY2VzIjpbImxpYi9zb3J0YWJsZWpzLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQXVCLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBRXBDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDOztBQU03RCxNQUFNLE9BQU8sZ0JBQWdCO0lBRXBCLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBZ0M7UUFDcEQsT0FBTztZQUNMLFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsU0FBUyxFQUFFO2dCQUNULEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFO2FBQzlDO1NBQ0YsQ0FBQztJQUNKLENBQUM7O29EQVRVLGdCQUFnQjsrR0FBaEIsZ0JBQWdCO3dGQUFoQixnQkFBZ0IsbUJBSFosbUJBQW1CLGFBQ3hCLG1CQUFtQjtrREFFbEIsZ0JBQWdCO2NBSjVCLFFBQVE7ZUFBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztnQkFDbkMsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUM7YUFDL0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgR0xPQkFMUyB9IGZyb20gJy4vZ2xvYmFscyc7XG5pbXBvcnQgeyBTb3J0YWJsZWpzT3B0aW9ucyB9IGZyb20gJy4vc29ydGFibGVqcy1vcHRpb25zJztcbmltcG9ydCB7IFNvcnRhYmxlanNEaXJlY3RpdmUgfSBmcm9tICcuL3NvcnRhYmxlanMuZGlyZWN0aXZlJztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbU29ydGFibGVqc0RpcmVjdGl2ZV0sXG4gIGV4cG9ydHM6IFtTb3J0YWJsZWpzRGlyZWN0aXZlXSxcbn0pXG5leHBvcnQgY2xhc3MgU29ydGFibGVqc01vZHVsZSB7XG5cbiAgcHVibGljIHN0YXRpYyBmb3JSb290KGdsb2JhbE9wdGlvbnM6IFNvcnRhYmxlanNPcHRpb25zKTogTW9kdWxlV2l0aFByb3ZpZGVyczxTb3J0YWJsZWpzTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBTb3J0YWJsZWpzTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHsgcHJvdmlkZTogR0xPQkFMUywgdXNlVmFsdWU6IGdsb2JhbE9wdGlvbnMgfSxcbiAgICAgIF0sXG4gICAgfTtcbiAgfVxuXG59XG4iXX0=