// import {Tile3DLayer} from '@deck.gl/geo-layers'; 
import {loadArcGISModules} from '@deck.gl/arcgis';
// import {I3SLoader} from '@loaders.gl/i3s';


export async function renderToDOM(container) {
  const {DeckRenderer, modules} = await loadArcGISModules([
    'esri/Map',
    'esri/views/SceneView',
    'esri/views/3d/externalRenderers',
    "esri/layers/TileLayer",
    "esri/layers/ElevationLayer"
  ]);
  const [ArcGISMap, SceneView, externalRenderers,TileLayer,ElevationLayer] = modules;
  const marsElevation = new ElevationLayer({
    url: "https://astro.arcgis.com/arcgis/rest/services/OnMars/MDEM200M/ImageServer",
    copyright:
      "NASA, ESA, HRSC, Goddard Space Flight Center, USGS Astrogeology Science Center, Esri"
  });
  const marsImagery = new TileLayer({   
    url: "https://astro.arcgis.com/arcgis/rest/services/OnMars/MDIM/MapServer",
    title: "Imagery",
    copyright: "USGS Astrogeology Science Center, NASA, JPL, Esri"
  });
  const sceneView = new SceneView({
    container,
    qualityProfile: 'high',      
    map: new ArcGISMap({
      ground: {
        layers: [marsElevation]
      },
      layers:[marsImagery]
    }),
// setting the spatial reference for Mars_2000 coordinate system
    spatialReference: {
      wkid: 104971

    },
    environment: {
      atmosphereEnabled: false
    },
    camera: {
      position: {
        x: 27.63423,
        y: -6.34466,
        z: 1281525.766,
        spatialReference: 104971
      },
      heading: 332.28,
      tilt: 37.12
    }
  });

  const renderer = new DeckRenderer(sceneView, {});
  externalRenderers.add(sceneView, renderer);

  return {
    remove: () => {
      sceneView.destroy();
      renderer.dispose();
    }
  };
}