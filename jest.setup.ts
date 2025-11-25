import "@testing-library/jest-dom";

// Polyfill for Radix UI's Pointer Events
class PointerEventPolyfill extends Event {
  public button: number;
  public ctrlKey: boolean;
  public pointerType: string;
  public pointerId: number;
  public width: number;
  public height: number;
  public pressure: number;
  public tangentialPressure: number;
  public tiltX: number;
  public tiltY: number;
  public twist: number;
  public isPrimary: boolean;

  constructor(type: string, props: PointerEventInit = {}) {
    super(type, props);
    this.button = props.button ?? 0;
    this.ctrlKey = props.ctrlKey ?? false;
    this.pointerType = props.pointerType ?? "mouse";
    this.pointerId = props.pointerId ?? 0;
    this.width = props.width ?? 0;
    this.height = props.height ?? 0;
    this.pressure = props.pressure ?? 0;
    this.tangentialPressure = props.tangentialPressure ?? 0;
    this.tiltX = props.tiltX ?? 0;
    this.tiltY = props.tiltY ?? 0;
    this.twist = props.twist ?? 0;
    this.isPrimary = props.isPrimary ?? false;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.PointerEvent = PointerEventPolyfill as any;

Element.prototype.hasPointerCapture = function () {
  return false;
};

Element.prototype.setPointerCapture = function () {};
Element.prototype.releasePointerCapture = function () {};

// ResizeObserver mock (also needed by Radix UI)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};