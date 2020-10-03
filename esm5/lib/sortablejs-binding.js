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
export { SortablejsBinding };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydGFibGVqcy1iaW5kaW5nLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXNvcnRhYmxlanMvIiwic291cmNlcyI6WyJsaWIvc29ydGFibGVqcy1iaW5kaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0lBRUUsMkJBQW9CLE1BQStCO1FBQS9CLFdBQU0sR0FBTixNQUFNLENBQXlCO0lBQUksQ0FBQztJQUV4RCxrQ0FBTSxHQUFOLFVBQU8sS0FBYSxFQUFFLElBQVM7UUFDN0IsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNqQzthQUFNO1lBQ0wsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNwQztJQUNILENBQUM7SUFFRCwrQkFBRyxHQUFILFVBQUksS0FBYTtRQUNmLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVELGtDQUFNLEdBQU4sVUFBTyxLQUFhO1FBQ2xCLElBQUksSUFBSSxDQUFDO1FBRVQsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM3QjthQUFNO1lBQ0wsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN4QztRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUlELHNCQUFZLDBDQUFXO1FBRnZCLDBEQUEwRDtRQUMxRCxxRUFBcUU7YUFDckU7WUFDRSwrRUFBK0U7WUFDL0UsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUN6RSxDQUFDOzs7T0FBQTtJQUVILHdCQUFDO0FBQUQsQ0FBQyxBQXBDRCxJQW9DQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNvcnRhYmxlanNCaW5kaW5nVGFyZ2V0IH0gZnJvbSAnLi9zb3J0YWJsZWpzLWJpbmRpbmctdGFyZ2V0JztcblxuZXhwb3J0IGNsYXNzIFNvcnRhYmxlanNCaW5kaW5nIHtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHRhcmdldDogU29ydGFibGVqc0JpbmRpbmdUYXJnZXQpIHsgfVxuXG4gIGluc2VydChpbmRleDogbnVtYmVyLCBpdGVtOiBhbnkpIHtcbiAgICBpZiAodGhpcy5pc0Zvcm1BcnJheSkge1xuICAgICAgdGhpcy50YXJnZXQuaW5zZXJ0KGluZGV4LCBpdGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50YXJnZXQuc3BsaWNlKGluZGV4LCAwLCBpdGVtKTtcbiAgICB9XG4gIH1cblxuICBnZXQoaW5kZXg6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLmlzRm9ybUFycmF5ID8gdGhpcy50YXJnZXQuYXQoaW5kZXgpIDogdGhpcy50YXJnZXRbaW5kZXhdO1xuICB9XG5cbiAgcmVtb3ZlKGluZGV4OiBudW1iZXIpIHtcbiAgICBsZXQgaXRlbTtcblxuICAgIGlmICh0aGlzLmlzRm9ybUFycmF5KSB7XG4gICAgICBpdGVtID0gdGhpcy50YXJnZXQuYXQoaW5kZXgpO1xuICAgICAgdGhpcy50YXJnZXQucmVtb3ZlQXQoaW5kZXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpdGVtID0gdGhpcy50YXJnZXQuc3BsaWNlKGluZGV4LCAxKVswXTtcbiAgICB9XG5cbiAgICByZXR1cm4gaXRlbTtcbiAgfVxuXG4gIC8vIHdlIG5lZWQgdGhpcyB0byBpZGVudGlmeSB0aGF0IHRoZSB0YXJnZXQgaXMgYSBGb3JtQXJyYXlcbiAgLy8gd2UgZG9uJ3Qgd2FudCB0byBoYXZlIGEgZGVwZW5kZW5jeSBvbiBAYW5ndWxhci9mb3JtcyBqdXN0IGZvciB0aGF0XG4gIHByaXZhdGUgZ2V0IGlzRm9ybUFycmF5KCkge1xuICAgIC8vIGp1c3QgY2hlY2tpbmcgZm9yIHJhbmRvbSBGb3JtQXJyYXkgbWV0aG9kcyBub3QgYXZhaWxhYmxlIG9uIGEgc3RhbmRhcmQgYXJyYXlcbiAgICByZXR1cm4gISF0aGlzLnRhcmdldC5hdCAmJiAhIXRoaXMudGFyZ2V0Lmluc2VydCAmJiAhIXRoaXMudGFyZ2V0LnJlc2V0O1xuICB9XG5cbn1cbiJdfQ==