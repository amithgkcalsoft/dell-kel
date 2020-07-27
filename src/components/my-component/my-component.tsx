import { Component, Prop, h, Watch, Listen, Element } from "@stencil/core";
import * as d3 from "d3";
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
  allData: Array<Object>;

  @Element() element: HTMLElement;
  parallCoords: any = this.element.shadowRoot.querySelectorAll(
    "parallel-coordinates"
  )[0];
  /**
   * The middle name
   */
  @Prop() middle: string;

  /**
   * The last name
   */
  @Prop() last: string;

  @Listen("brushCompleted")
  brushCompletedHandler(event: CustomEvent<Array<Object>>) {
    debugger;
    console.log("Received the custom todoCompleted event: ", event.detail);
  }

  @Watch("selectedRange")
  watchHandler(newValue) {
    console.log(newValue);
  }
  componentDidLoad() {
    let myComp: any = this;
    d3.csv("./data/sampleData.csv").then(function (data) {
      data = data.slice(0, 66);

      data.forEach((d) => {
        d.Time = new Date(
          d3.timeFormat("%a %b %d %X CDT %Y")(
            new Date(+d.Time ? +d.Time : d.Time.replace("Z", ""))
          )
        );
        for (const property in d) {
          if (
            property != "Time" &&
            property != "compute" &&
            property != "group" &&
            property != "id" &&
            property != "name" &&
            property != "rack"
          )
            d[property] = JSON.parse(d[property]);
        }
        // let cmp = document.querySelector("parallel-coordinates");
        // cmp.completeData = data;
      });
      let cmp = myComp.element.shadowRoot.querySelectorAll(
        "parallel-coordinates"
      )[0];

      cmp.completeData = data;
    });
  }
  componentWillLoad() {
    this.watchHandler(this.selectedRange);
  }

  render() {
    return <parallel-coordinates complete-data="[]"></parallel-coordinates>;
  }
}
// export const myComps = new MyComponent();
