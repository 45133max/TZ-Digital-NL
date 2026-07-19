/**
 * TZ Digital — Hero Three.js wireframe scene
 * Low-poly wireframe sphere with orbiting icon moons.
 */
(function () {
  'use strict';

  const MOON_CONFIG = [
    { icon: '/assets/icon-browser.svg', radius: 2.8, speed: 1.0, offset: 0 },
    { icon: '/assets/icon-cursor.svg', radius: 3.4, speed: 1.4, offset: 1.2 },
    { icon: '/assets/icon-code.svg', radius: 2.2, speed: 0.8, offset: 2.5 },
    { icon: '/assets/icon-button.svg', radius: 3.0, speed: 1.1, offset: 4.0 },
  ];

  const ROTATION_TURNS = 2;
  const PAYOFF_START = 0.88;

  window.TZHeroScene = function (canvas, options) {
    options = options || {};
    const reducedMotion = options.reducedMotion || false;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 8;

    const accentColor = 0x7b61ff;
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    const geometry = new THREE.IcosahedronGeometry(1.8, 1);
    const material = new THREE.MeshBasicMaterial({
      color: accentColor,
      wireframe: true,
    });
    const wireframe = new THREE.Mesh(geometry, material);
    sphereGroup.add(wireframe);

    const moons = [];
    const textureLoader = new THREE.TextureLoader();
    let texturesLoaded = 0;

    MOON_CONFIG.forEach(function (config) {
      textureLoader.load(
        config.icon,
        function (texture) {
          texture.generateMipmaps = false;
          texture.minFilter = THREE.LinearFilter;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;

          const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 0.9,
          });
          const sprite = new THREE.Sprite(spriteMaterial);
          sprite.scale.set(0.55, 0.55, 1);
          sphereGroup.add(sprite);
          moons.push({
            sprite: sprite,
            radius: config.radius,
            speed: config.speed,
            offset: config.offset,
          });
          texturesLoaded++;
          if (texturesLoaded === MOON_CONFIG.length) {
            applyProgress(reducedMotion ? 1 : 0);
            render();
          }
        },
        undefined,
        function (error) {
          console.warn('TZ Hero: failed to load moon icon', config.icon, error);
        }
      );
    });

    function updateMoons(baseAngle) {
      moons.forEach(function (moon) {
        const angle = baseAngle * moon.speed + moon.offset;
        moon.sprite.position.set(
          Math.cos(angle) * moon.radius,
          Math.sin(angle * 0.7) * moon.radius * 0.45,
          Math.sin(angle) * moon.radius * 0.35
        );
      });
    }

    function applyProgress(progress) {
      const rotationAngle = progress * Math.PI * 2 * ROTATION_TURNS;
      wireframe.rotation.y = rotationAngle;
      wireframe.rotation.x = rotationAngle * 0.25;
      updateMoons(rotationAngle);

      let payoffProgress = 0;
      if (progress >= PAYOFF_START) {
        payoffProgress = (progress - PAYOFF_START) / (1 - PAYOFF_START);
      }

      const scale = 1 + payoffProgress * 0.35;
      const opacity = 1 - payoffProgress * 0.85;
      sphereGroup.scale.set(scale, scale, scale);
      material.opacity = opacity;
      material.transparent = payoffProgress > 0;

      moons.forEach(function (moon) {
        moon.sprite.material.opacity = 0.9 * opacity;
      });
    }

    function resize() {
      const parent = canvas.parentElement;
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function render() {
      renderer.render(scene, camera);
    }

    resize();

    if (reducedMotion) {
      applyProgress(1);
      render();
    }

    return {
      updateProgress: function (progress) {
        applyProgress(progress);
        render();
      },
      resize: resize,
      destroy: function () {
        geometry.dispose();
        material.dispose();
        moons.forEach(function (moon) {
          if (moon.sprite.material.map) moon.sprite.material.map.dispose();
          moon.sprite.material.dispose();
        });
        renderer.dispose();
      },
    };
  };
})();
