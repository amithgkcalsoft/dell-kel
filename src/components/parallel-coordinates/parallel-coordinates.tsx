import {
  Component,
  ComponentInterface,
  h,
  Element,
  Prop,
  Watch,
  Host,
} from "@stencil/core";
import * as d3 from "d3";
import _ from "underscore";
import { main } from "../../js/main";
import { setting } from "../../js/setting";
import { myServicee } from "../../services/my-service";
@Component({
  tag: "parallel-coordinates",
  styleUrl: "parallel-coordinates.css",
  shadow: true,
})
export class ParallelCoordinates implements ComponentInterface {
  @Prop()
  singleData: string;
  @Prop()
  completedata: Array<Object>;
  @Element() element: HTMLElement;

  yscale: any = {};
  mains = main();
  settings = setting();

  @Watch("completedata")
  watchHandler(newValue) {
    let elementsObj = myServicee.setCanvusElements(this.element);
    if (newValue != undefined) {
      let serviceFullList_withExtra = this.settings.getServiceFLE();
      this.mains.initFunc(newValue, serviceFullList_withExtra, elementsObj);
    }
  }

  componentDidLoad() {
    let fulldata = this;
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
      });
      fulldata.completedata = data;
    });
  }
  componentWillLoad() {
    this.watchHandler(this.completedata);
  }
  render() {
    return (
      <Host>
        <div id="chart">
          <canvas id="background"></canvas>
          <canvas id="foreground"></canvas>
          <canvas id="highlight"></canvas>
          <svg width="900" height="300"></svg>
        </div>
        <div>
          <label> Show: </label>
          <select id="overlayPlot">
            <option value="none">None</option>
            <option value="tick" selected>
              ticks
            </option>
            <option value="violin">Violin plots</option>
            <option value="violin+tick">Violin plots + ticks</option>
          </select>
        </div>
      </Host>
    );
  }
}
