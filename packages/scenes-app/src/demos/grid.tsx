import {
  SceneGridLayout,
  SceneGridItem,
  // SceneFlexLayout,
  // SceneFlexItem,
  SceneAppPage,
  EmbeddedScene,
  SceneAppPageState,
  PanelBuilders,
  SceneVariableSet,
  TextBoxVariable,
  behaviors,
  SceneObjectState,
  SceneObjectBase,
} from '@grafana/scenes';
import { getQueryRunnerWithRandomWalkQuery, getEmbeddedSceneDefaults } from './utils';

export function getGridLayoutTest(defaults: SceneAppPageState): SceneAppPage {
  return new SceneAppPage({
    ...defaults,
    subTitle: 'Demo of the SceneGridLayout',
    getScene: () => {
      return new EmbeddedScene({
        ...getEmbeddedSceneDefaults(),
        $data: getQueryRunnerWithRandomWalkQuery(),
        $behaviors: [getVariableChangeBehavior('npanel'), getVariableChangeBehavior('ncol')],
        $variables: new SceneVariableSet({
          variables: [
            new TextBoxVariable({
              name: 'ncol',
              value: '1',

            }),
            new TextBoxVariable({
              name: 'npanel',
              value: '1',
            }),
          ],
        }),
        body: new SceneGridLayout({
          isDraggable: true,
          children: getLayoutChildren(1,1)
        }),
      });
    },
  });
}

function getLayoutChildren(count: number, ncol: number) {
  return Array.from(Array(count), (v, index) => {
    const x = 0 + Math.floor(25 / ncol) * (index % ncol);
    const width = Math.floor(25 / ncol);
    return new SceneGridItem({
      x: x,
      y: 0,
      width: width,
      height: 10,
      isResizable: true,
      isDraggable: true,
      body: PanelBuilders.timeseries().setTitle('Draggable and resizable').build(),
    })
  }
  );
}

function getVariableChangeBehavior(variableName: string) {
  return new behaviors.ActWhenVariableChanged({
    variableName,
    onChange: (variable) => {
      const scene: EmbeddedScene = variable.parent?.parent;
      console.log(scene.state.$variables?.getByName('ncol')?.state.value);
      scene.setState({
        body: new SceneGridLayout({
          isDraggable: true,
          children: getLayoutChildren(Number(scene.state.$variables?.getByName('npanel')?.state.value),Number(scene.state.$variables?.getByName('ncol')?.state.value))
        }),
      })
      console.log(`${variable.state.name} changed`);
    },
  });
}
