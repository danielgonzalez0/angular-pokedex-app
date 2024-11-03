export class CreateSignal<T> {
  private value: T;
  private observers: Set<() => void> = new Set();

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  // Méthode pour accéder et appeler l'instance comme une fonction
  public get(): T {
    return this.value;
  }

  public set(newValue: T): void {
    if (this.value !== newValue) {
      this.value = newValue;
      this.notifyObservers();
    }
  }

  public update(updater: (currentValue: T) => T): void {
    this.set(updater(this.value));
  }

  public watch(callback: () => void): void {
    this.observers.add(callback);
  }

  private notifyObservers(): void {
    this.observers.forEach((callback) => callback());
  }

  // Rendre l'instance callable
  public call(): T {
    return this.get();
  }
}