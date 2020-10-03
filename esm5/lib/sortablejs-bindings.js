import { SortablejsBinding } from './sortablejs-binding';
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
export { SortablejsBindings };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydGFibGVqcy1iaW5kaW5ncy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb3J0YWJsZWpzLyIsInNvdXJjZXMiOlsibGliL3NvcnRhYmxlanMtYmluZGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFHekQ7SUFJRSw0QkFBWSxjQUF5QztRQUNuRCxJQUFJLENBQUMsUUFBUSxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsVUFBQSxNQUFNLElBQUksT0FBQSxJQUFJLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxFQUE3QixDQUE2QixDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVELDRDQUFlLEdBQWYsVUFBZ0IsS0FBYSxFQUFFLEtBQVk7UUFDekMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQXpCLENBQXlCLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQseUNBQVksR0FBWixVQUFhLEtBQWE7UUFDeEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQVosQ0FBWSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELDZDQUFnQixHQUFoQixVQUFpQixLQUFhO1FBQzVCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFmLENBQWUsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxzQkFBSSx3Q0FBUTthQUFaO1lBQ0UsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDaEMsQ0FBQzs7O09BQUE7SUFFSCx5QkFBQztBQUFELENBQUMsQUF4QkQsSUF3QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTb3J0YWJsZWpzQmluZGluZyB9IGZyb20gJy4vc29ydGFibGVqcy1iaW5kaW5nJztcbmltcG9ydCB7IFNvcnRhYmxlanNCaW5kaW5nVGFyZ2V0IH0gZnJvbSAnLi9zb3J0YWJsZWpzLWJpbmRpbmctdGFyZ2V0JztcblxuZXhwb3J0IGNsYXNzIFNvcnRhYmxlanNCaW5kaW5ncyB7XG5cbiAgYmluZGluZ3M6IFNvcnRhYmxlanNCaW5kaW5nW107XG5cbiAgY29uc3RydWN0b3IoYmluZGluZ1RhcmdldHM6IFNvcnRhYmxlanNCaW5kaW5nVGFyZ2V0W10pIHtcbiAgICB0aGlzLmJpbmRpbmdzID0gYmluZGluZ1RhcmdldHMubWFwKHRhcmdldCA9PiBuZXcgU29ydGFibGVqc0JpbmRpbmcodGFyZ2V0KSk7XG4gIH1cblxuICBpbmplY3RJbnRvRXZlcnkoaW5kZXg6IG51bWJlciwgaXRlbXM6IGFueVtdKSB7XG4gICAgdGhpcy5iaW5kaW5ncy5mb3JFYWNoKChiLCBpKSA9PiBiLmluc2VydChpbmRleCwgaXRlbXNbaV0pKTtcbiAgfVxuXG4gIGdldEZyb21FdmVyeShpbmRleDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuYmluZGluZ3MubWFwKGIgPT4gYi5nZXQoaW5kZXgpKTtcbiAgfVxuXG4gIGV4dHJhY3RGcm9tRXZlcnkoaW5kZXg6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLmJpbmRpbmdzLm1hcChiID0+IGIucmVtb3ZlKGluZGV4KSk7XG4gIH1cblxuICBnZXQgcHJvdmlkZWQoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5iaW5kaW5ncy5sZW5ndGg7XG4gIH1cblxufVxuIl19