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
  watchCompleteData() {
    debugger;
    let elementsObj = myServicee.setCanvusElements(this.element);
    d3.selectAll(
      elementsObj.element.shadowRoot.querySelectorAll("svg g")
    ).remove();

    if (this.completedata != undefined) {
      let serviceFullList_withExtra = this.settings.getServiceFLE();
      this.mains.initFunc(
        this.completedata,
        serviceFullList_withExtra,
        elementsObj
      );
    }
  }

  componentDidLoad() {
    debugger;
    let elementsObj = myServicee.setCanvusElements(this.element);
    if (this.completedata != undefined) {
      let serviceFullList_withExtra = this.settings.getServiceFLE();
      this.mains.initFunc(
        this.completedata,
        serviceFullList_withExtra,
        elementsObj
      );
    }
    // let fulldata = this;
    // d3.csv("./data/sampleData.csv").then(function (data) {
    //   data = data.slice(0, 66);
    //   data.forEach((d) => {
    //     d.Time = new Date(
    //       d3.timeFormat("%a %b %d %X CDT %Y")(
    //         new Date(+d.Time ? +d.Time : d.Time.replace("Z", ""))
    //       )
    //     );
    //     for (const property in d) {
    //       if (
    //         property != "Time" &&
    //         property != "compute" &&
    //         property != "group" &&
    //         property != "id" &&
    //         property != "name" &&
    //         property != "rack"
    //       )
    //         d[property] = JSON.parse(d[property]);
    //     }
    //   });
    //   fulldata.completedata = data;
    // });
  }
  // componentWillLoad() {
  //   debugger;
  //   this.watchCompleteData();
  // }
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
        <div>
          <table
            class="table table-striped table-hover row s12"
            id="axisSetting"
          >
            <thead class="thead-dark">
              <tr>
                <th></th>
                <th>Color by</th>
                <th>Metric</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </Host>
    );
  }
}
