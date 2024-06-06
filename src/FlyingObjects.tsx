import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { ObjectConfig } from './index';

interface FlyingObjectsProps {
  objectConfig: ObjectConfig;
}

const FlyingObjects = ({ objectConfig }: FlyingObjectsProps) => {
  const defaultConfig = {
    top: {
      fromValue: 100,
      toValue: 35,
      duration: 1200,
      easing: Easing.bezier(0.5, 1.0, 0.5, 1.0),
      delay: 0,
    },
    right: {
      fromValue: 0,
      toValue: 0,
      duration: 1200,
      easing: Easing.linear,
      delay: 0,
    },
    show: {
      duration: 500,
      delay: 0,
    },
    hide: {
      duration: 500,
      delay: 0,
    },
  };

  const { object, top, right, show, hide } = objectConfig;

  const topValue = useSharedValue(top?.fromValue ?? defaultConfig.top.fromValue);
  const rightValue = useSharedValue(right?.fromValue ?? defaultConfig.right.fromValue);
  const opacityValue = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    top: topValue.value,
    right: rightValue.value,
    opacity: opacityValue.value,
  }));

  useEffect(() => {
    const maxDuration = Math.max(
      top?.duration ?? defaultConfig.top.duration,
      right?.duration ?? defaultConfig.right.duration,
    );

    opacityValue.value = withDelay(
      show?.delay ?? defaultConfig.show.delay,
      withTiming(1, {
        duration: show?.duration ?? defaultConfig.show.duration,
      }),
    );

    topValue.value = withDelay(
      top?.delay ?? defaultConfig.top.delay,
      withTiming(top?.toValue ?? defaultConfig.top.toValue, {
        duration: top?.duration ?? defaultConfig.top.duration,
        easing: top?.easing ?? defaultConfig.top.easing,
      }),
    );

    rightValue.value = withDelay(
      right?.delay ?? defaultConfig.right.delay,
      withTiming(right?.toValue ?? defaultConfig.right.toValue, {
        duration: right?.duration ?? defaultConfig.right.duration,
        easing: right?.easing ?? defaultConfig.right.easing,
      }),
    );

    const fadeOutStartDelay = maxDuration - (hide?.duration ?? defaultConfig.hide.duration);

    opacityValue.value = withDelay(
      fadeOutStartDelay > 0 ? fadeOutStartDelay : 0,
      withTiming(0, {
        duration: hide?.duration ?? defaultConfig.hide.duration,
        easing: Easing.linear,
      }),
    );
  }, []);

  return <Animated.View style={[styles.object, animatedStyles]}>{object}</Animated.View>;
};

const styles = StyleSheet.create({
  object: {
    position: 'absolute',
  },
});

export default FlyingObjects;
