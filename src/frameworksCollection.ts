class FrameworksCollection {
  private value;
  constructor(value = []) {
    this.value = value;
  }
  get current() {
    return this.value;
  }
  add(framework) {
    this.value.push(framework);
  }
}

export default new FrameworksCollection();
