/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface MyComponent {
        /**
          * The last name
         */
        "last": string;
        /**
          * The middle name
         */
        "middle": string;
        /**
          * The first name
         */
        "selectedRange": Array<Object>;
    }
    interface ParallelCoordinates {
        "completeData": Array<Object>;
        "singleData": string;
    }
    interface SecComponent {
    }
}
declare global {
    interface HTMLMyComponentElement extends Components.MyComponent, HTMLStencilElement {
    }
    var HTMLMyComponentElement: {
        prototype: HTMLMyComponentElement;
        new (): HTMLMyComponentElement;
    };
    interface HTMLParallelCoordinatesElement extends Components.ParallelCoordinates, HTMLStencilElement {
    }
    var HTMLParallelCoordinatesElement: {
        prototype: HTMLParallelCoordinatesElement;
        new (): HTMLParallelCoordinatesElement;
    };
    interface HTMLSecComponentElement extends Components.SecComponent, HTMLStencilElement {
    }
    var HTMLSecComponentElement: {
        prototype: HTMLSecComponentElement;
        new (): HTMLSecComponentElement;
    };
    interface HTMLElementTagNameMap {
        "my-component": HTMLMyComponentElement;
        "parallel-coordinates": HTMLParallelCoordinatesElement;
        "sec-component": HTMLSecComponentElement;
    }
}
declare namespace LocalJSX {
    interface MyComponent {
        /**
          * The last name
         */
        "last"?: string;
        /**
          * The middle name
         */
        "middle"?: string;
        /**
          * The first name
         */
        "selectedRange"?: Array<Object>;
    }
    interface ParallelCoordinates {
        "completeData"?: Array<Object>;
        "onBrushCompleted"?: (event: CustomEvent<Array<Object>>) => void;
        "singleData"?: string;
    }
    interface SecComponent {
        "onTodoCompleted"?: (event: CustomEvent<Array<Object>>) => void;
    }
    interface IntrinsicElements {
        "my-component": MyComponent;
        "parallel-coordinates": ParallelCoordinates;
        "sec-component": SecComponent;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "my-component": LocalJSX.MyComponent & JSXBase.HTMLAttributes<HTMLMyComponentElement>;
            "parallel-coordinates": LocalJSX.ParallelCoordinates & JSXBase.HTMLAttributes<HTMLParallelCoordinatesElement>;
            "sec-component": LocalJSX.SecComponent & JSXBase.HTMLAttributes<HTMLSecComponentElement>;
        }
    }
}
