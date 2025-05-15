declare module 'tippy.js' {
  const tippy: (
    targets: Element | Element[] | NodeList | string,
    options?: {
      content?: string | ((reference: Element) => string);
      placement?: 'top' | 'bottom' | 'left' | 'right';
      trigger?: string;
    }
  ) => void;
  export default tippy;
}
