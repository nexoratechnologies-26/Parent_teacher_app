import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const BottomLandscape: React.FC = () => {
  return (
    <View style={styles.container} pointerEvents="none">
      {/* Cloud left */}
      <View style={[styles.cloud, styles.cloudLeft]}>
        <View style={styles.cloudPartMain} />
        <View style={styles.cloudPartSmall} />
      </View>

      {/* Cloud right */}
      <View style={[styles.cloud, styles.cloudRight]}>
        <View style={styles.cloudPartMain} />
        <View style={styles.cloudPartSmall} />
      </View>

      {/* Background Hills */}
      <View style={styles.hillBackLeft} />
      <View style={styles.hillBackRight} />

      {/* Foreground Hills */}
      <View style={styles.hillFrontLeft}>
        {/* Cute little flower on left hill */}
        <View style={styles.flower}>
          <View style={styles.petalTop} />
          <View style={styles.petalBottom} />
          <View style={styles.petalLeft} />
          <View style={styles.petalRight} />
          <View style={styles.flowerCenter} />
        </View>
      </View>

      <View style={styles.hillFrontRight}>
        {/* Cute little flower on right hill */}
        <View style={styles.flower}>
          <View style={styles.petalTop} />
          <View style={styles.petalBottom} />
          <View style={styles.petalLeft} />
          <View style={styles.petalRight} />
          <View style={styles.flowerCenter} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    overflow: 'hidden',
    zIndex: 0,
  },
  cloud: {
    position: 'absolute',
    zIndex: 1,
  },
  cloudLeft: {
    bottom: 60,
    left: 20,
  },
  cloudRight: {
    bottom: 65,
    right: 30,
  },
  cloudPartMain: {
    width: 44,
    height: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    opacity: 0.9,
    shadowColor: '#E2D9C8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cloudPartSmall: {
    position: 'absolute',
    top: -8,
    left: 10,
    width: 22,
    height: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 11,
  },
  hillBackLeft: {
    position: 'absolute',
    bottom: -30,
    left: -40,
    width: width * 0.6,
    height: 100,
    borderRadius: 80,
    backgroundColor: '#7DC887',
    transform: [{ rotate: '-12deg' }],
  },
  hillBackRight: {
    position: 'absolute',
    bottom: -30,
    right: -40,
    width: width * 0.6,
    height: 100,
    borderRadius: 80,
    backgroundColor: '#86D190',
    transform: [{ rotate: '12deg' }],
  },
  hillFrontLeft: {
    position: 'absolute',
    bottom: -45,
    left: -20,
    width: width * 0.55,
    height: 100,
    borderRadius: 90,
    backgroundColor: '#58B868',
    transform: [{ rotate: '-6deg' }],
    zIndex: 2,
    paddingTop: 15,
    paddingLeft: 40,
  },
  hillFrontRight: {
    position: 'absolute',
    bottom: -45,
    right: -20,
    width: width * 0.55,
    height: 100,
    borderRadius: 90,
    backgroundColor: '#4EAA5E',
    transform: [{ rotate: '6deg' }],
    zIndex: 2,
    paddingTop: 15,
    paddingRight: 40,
    alignItems: 'flex-end',
  },
  flower: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flowerCenter: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
    zIndex: 2,
  },
  petalTop: {
    position: 'absolute',
    top: 1,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FFD166',
  },
  petalBottom: {
    position: 'absolute',
    bottom: 1,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FFD166',
  },
  petalLeft: {
    position: 'absolute',
    left: 1,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FFD166',
  },
  petalRight: {
    position: 'absolute',
    right: 1,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FFD166',
  },
});
