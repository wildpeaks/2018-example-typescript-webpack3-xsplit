/* eslint-env browser */
import {ready, Scene, Source} from 'xjs-framework';
import {MyComponent} from 'components/MyComponent';
import './extension.css';

type SceneData = {
	index: number;
	scene: Scene;
	sceneName: string;
	sources: Source[];
};

async function getSceneInfo(index: number): Promise<SceneData> {
	const scene = await Scene.getById(index);
	const sceneName = await scene.getName();
	const sources = await scene.getSources();
	return {
		index,
		scene,
		sceneName,
		sources
	};
}

async function getScenes(): Promise<SceneData[]> {
	const count = await Scene.getSceneCount();
	const indexes = [];
	for (let i = 1; i < count + 1; i++){
		indexes.push(i);
	}
	const scenes = await Promise.all(indexes.map(getSceneInfo));
	return scenes;
}


ready({})
.then(async() => {
	const scenes = await getScenes();

	const h1 = document.createElement('h1');
	h1.innerHTML = `There are ${scenes.length} scenes.`;
	document.body.appendChild(h1);

	scenes.forEach(sceneData => {
		const {index, scene, sceneName, sources} = sceneData;
		const text = `${sceneName} has ${sources.length} sources`;
		const component = new MyComponent(text);
		component.element.addEventListener('click', () => {
			console.log(`Switching to scene ${index}`);
			Scene.setActiveScene(scene);
		});
		document.body.appendChild(component.element);
	});
});
