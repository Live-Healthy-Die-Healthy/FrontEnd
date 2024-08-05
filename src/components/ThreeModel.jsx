import React, { useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import styled from "styled-components";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

function Model({ animationName }) {
    const [model, setModel] = useState();
    const [mixer, setMixer] = useState();
    const [animations, setAnimations] = useState({});

    useEffect(() => {
        new GLTFLoader().load("./toon_cat_free/scene.gltf", (gltf) => {
            const newModel = gltf.scene;
            newModel.position.set(0, -0.8, 0); // 모델의 위치를 약간 아래로 조정
            setModel(newModel);

            const newMixer = new THREE.AnimationMixer(newModel);
            setMixer(newMixer);

            const newAnimations = {};
            gltf.animations.forEach((clip) => {
                newAnimations[clip.name] = newMixer.clipAction(clip);
            });
            setAnimations(newAnimations);
        });
    }, []);

    useFrame((state, delta) => {
        mixer?.update(delta);
    });

    useEffect(() => {
        if (animations[animationName]) {
            Object.values(animations).forEach((action) => action.stop());
            animations[animationName].play();
        }
    }, [animationName, animations]);

    if (!model) return null;
    return <primitive object={model} scale={[0.009, 0.009, 0.009]} />; // 모델 크기를 줄이기 위해 scale 변경
}

function Camera() {
    const { camera } = useThree();

    useEffect(() => {
        camera.position.set(-1, 2, 5); // 카메라 위치를 멀리 설정
    }, [camera]);

    return null;
}

export default function ThreeModel() {
    const [animationName, setAnimationName] = useState("Scene");

    return (
        <Container>
            <Canvas
                style={{
                    width: "100%",
                    height: "43vh", // Canvas 크기를 줄임
                    background: "#FFEEAE", //#ffbbb4
                }}
            >
                <Camera />
                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2}
                />
                <ambientLight intensity={0.8} />
                <directionalLight color='yellow' position={[0, 1, 0]} />
                <Model animationName={animationName} />
            </Canvas>
            {/* <div>
                <AnimationButton onClick={() => setAnimationName("Idle")}>
                    Idle
                </AnimationButton>
                <AnimationButton onClick={() => setAnimationName("Dance")}>
                    Dance
                </AnimationButton>
                <AnimationButton onClick={() => setAnimationName("Walking")}>
                    Walking
                </AnimationButton>
                <AnimationButton onClick={() => setAnimationName("Jump")}>
                    Jump
                </AnimationButton>
            </div> */}
        </Container>
    );
}
