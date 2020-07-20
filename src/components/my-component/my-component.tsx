import { Component, Prop, h, Watch, Listen } from "@stencil/core";

@Component({
  tag: "my-component",
  styleUrl: "my-component.css",
  shadow: true,
})
export class MyComponent {
  /**
   * The first name
   */
  @Prop() selectedRange: Array<Object>;

  /**
   * The middle name
   */
  @Prop() middle: string;

  /**
   * The last name
   */
  @Prop() last: string;

  @Listen("todoCompleted")
  todoCompletedHandler(event: CustomEvent<String>) {
    console.log("Received the custom todoCompleted event: ", event.detail);
  }

  @Watch("selectedRange")
  watchHandler(newValue) {
    console.log(newValue);
  }

  componentWillLoad() {
    this.watchHandler(this.selectedRange);
  }

  render() {
    return <div>Hello, World! I'm</div>;
  }
}
// export const myComps = new MyComponent();
