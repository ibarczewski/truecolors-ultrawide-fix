export default class FrameworksCollection {
  private value;
  constructor(value = []) {
    this.value = value;
  }
  get current() {
    return this.value;
  }
  add(framework) {
    this.value = [...this.value, framework];
  }
}
