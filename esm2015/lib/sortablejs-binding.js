export class SortablejsBinding {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydGFibGVqcy1iaW5kaW5nLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXNvcnRhYmxlanMvIiwic291cmNlcyI6WyJsaWIvc29ydGFibGVqcy1iaW5kaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sT0FBTyxpQkFBaUI7SUFFNUIsWUFBb0IsTUFBK0I7UUFBL0IsV0FBTSxHQUFOLE1BQU0sQ0FBeUI7SUFBSSxDQUFDO0lBRXhELE1BQU0sQ0FBQyxLQUFhLEVBQUUsSUFBUztRQUM3QixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ2pDO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3BDO0lBQ0gsQ0FBQztJQUVELEdBQUcsQ0FBQyxLQUFhO1FBQ2YsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQWE7UUFDbEIsSUFBSSxJQUFJLENBQUM7UUFFVCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEIsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdCO2FBQU07WUFDTCxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3hDO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsMERBQTBEO0lBQzFELHFFQUFxRTtJQUNyRSxJQUFZLFdBQVc7UUFDckIsK0VBQStFO1FBQy9FLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDekUsQ0FBQztDQUVGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU29ydGFibGVqc0JpbmRpbmdUYXJnZXQgfSBmcm9tICcuL3NvcnRhYmxlanMtYmluZGluZy10YXJnZXQnO1xuXG5leHBvcnQgY2xhc3MgU29ydGFibGVqc0JpbmRpbmcge1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgdGFyZ2V0OiBTb3J0YWJsZWpzQmluZGluZ1RhcmdldCkgeyB9XG5cbiAgaW5zZXJ0KGluZGV4OiBudW1iZXIsIGl0ZW06IGFueSkge1xuICAgIGlmICh0aGlzLmlzRm9ybUFycmF5KSB7XG4gICAgICB0aGlzLnRhcmdldC5pbnNlcnQoaW5kZXgsIGl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRhcmdldC5zcGxpY2UoaW5kZXgsIDAsIGl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIGdldChpbmRleDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNGb3JtQXJyYXkgPyB0aGlzLnRhcmdldC5hdChpbmRleCkgOiB0aGlzLnRhcmdldFtpbmRleF07XG4gIH1cblxuICByZW1vdmUoaW5kZXg6IG51bWJlcikge1xuICAgIGxldCBpdGVtO1xuXG4gICAgaWYgKHRoaXMuaXNGb3JtQXJyYXkpIHtcbiAgICAgIGl0ZW0gPSB0aGlzLnRhcmdldC5hdChpbmRleCk7XG4gICAgICB0aGlzLnRhcmdldC5yZW1vdmVBdChpbmRleCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZW0gPSB0aGlzLnRhcmdldC5zcGxpY2UoaW5kZXgsIDEpWzBdO1xuICAgIH1cblxuICAgIHJldHVybiBpdGVtO1xuICB9XG5cbiAgLy8gd2UgbmVlZCB0aGlzIHRvIGlkZW50aWZ5IHRoYXQgdGhlIHRhcmdldCBpcyBhIEZvcm1BcnJheVxuICAvLyB3ZSBkb24ndCB3YW50IHRvIGhhdmUgYSBkZXBlbmRlbmN5IG9uIEBhbmd1bGFyL2Zvcm1zIGp1c3QgZm9yIHRoYXRcbiAgcHJpdmF0ZSBnZXQgaXNGb3JtQXJyYXkoKSB7XG4gICAgLy8ganVzdCBjaGVja2luZyBmb3IgcmFuZG9tIEZvcm1BcnJheSBtZXRob2RzIG5vdCBhdmFpbGFibGUgb24gYSBzdGFuZGFyZCBhcnJheVxuICAgIHJldHVybiAhIXRoaXMudGFyZ2V0LmF0ICYmICEhdGhpcy50YXJnZXQuaW5zZXJ0ICYmICEhdGhpcy50YXJnZXQucmVzZXQ7XG4gIH1cblxufVxuIl19