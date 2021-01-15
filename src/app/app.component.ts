import {Component, OnInit} from '@angular/core';
import Point from '@arcgis/core/geometry/Point';
import MeshMaterial from '@arcgis/core/geometry/support/MeshMaterial';
import Mesh from '@arcgis/core/geometry/Mesh';
import Graphic from '@arcgis/core/Graphic';
import MeshSymbol3D from '@arcgis/core/symbols/MeshSymbol3D';
import Map from '@arcgis/core/Map';
import SceneView from '@arcgis/core/views/SceneView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'arcgisCoreMeshIssue';

  ngOnInit() {
    const map = new Map({
      basemap: 'gray',
      ground: {
        navigationConstraint: {
          type: 'none'
        }
      }
    });
    const view = new SceneView({
      map,
      container: 'mapDiv',
      popup: {
        autoOpenEnabled: false
      },
      camera: {
        tilt: 45
      }
    });
    const point = new Point({
      latitude: 37,
      longitude: -122,
      z: -20,
    });
    const meshGeometry = Mesh.createCylinder(point, {
      size: {
        width: 10,
        depth: 10,
        height: 20.1,
      },
      material: new MeshMaterial()
    });
    const meshPointGraphic = new Graphic({
      geometry: meshGeometry,
      symbol: new MeshSymbol3D(),
      attributes: {
        ObjectID: 1
      }
    });
    const layer = new FeatureLayer({
      geometryType: 'mesh',
      source: [meshPointGraphic],
      elevationInfo: {
        mode: 'relative-to-ground'
      },
      objectIdField: 'ObjectID',
      spatialReference: {
        wkid: 4326
      },
      renderer: new SimpleRenderer({
        symbol: new MeshSymbol3D({
          symbolLayers: [{type: 'fill'}]
        })
      })
    });
    map.layers.add(layer);
    // view.when().then(() => view.goTo([meshPointGraphic]));

    let highlight;
    view.whenLayerView(layer).then((layerView) => {
      const query = layer.createQuery();
      query.where = '1=1';
      layer.queryFeatures(query).then((result) => {
        if (highlight) {
          highlight.remove();
        }
        highlight = layerView.highlight(result.features);
        view.goTo({target: result.features, zoom: 19}, {animate: true});
      });
    });
  }


}

