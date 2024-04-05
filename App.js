import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useCallback, useRef, useState} from 'react';
import { SafeAreaView, StyleSheet, Text, View, StatusBar, Dimensions} from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

import ActivitySettings from './components/ActivitySettings';
import Activity from './components/Activity';

SplashScreen.preventAutoHideAsync();

const {width, height} = Dimensions.get('screen');

export default function App() {

  const [fontsLoaded, fontError] = useFonts({
    'Supreme-Light': require('./data/fonts/otf/Supreme-Light.otf'),
    'Supreme-Regular': require('./data/fonts/otf/Supreme-Regular.otf'),
    'Supreme-Medium': require('./data/fonts/otf/Supreme-Medium.otf'),
    'Supreme-Bold': require('./data/fonts/otf/Supreme-Bold.otf')
  });
  
  
  const bottomSheetRef = useRef(BottomSheet);
  const snapPoints = ['1%', '60%'];

  const [goal, setGoal] = useState(20);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }


  StatusBar.setBarStyle('light-content', true)

  const triggerBottomSheet = () =>{
    bottomSheetRef.current?.expand()
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <LinearGradient  style={styles.gradient} colors={['rgba(39, 138, 245, 0.1)', 'transparent']}/> 
        <SafeAreaView>            
          <Activity triggerBottomSheet={triggerBottomSheet} goal={goal}/>
          <>
            <BottomSheet
              ref={bottomSheetRef}
              snapPoints={snapPoints}
              backgroundStyle={styles.bottomsheet}
            >
              <BottomSheetView style={styles.contentContainer}>
                <ActivitySettings goal={goal} setGoal={setGoal}/>
              </BottomSheetView>
            </BottomSheet>
          </>
        </SafeAreaView>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111718',
  },

  gradient:{
    width: '200%',
    height: '100%',
    position: 'absolute',
  },

  backdropComponent:{
    width: '100%',
    height: '100%',
    backgroundColor: 'black'
  },

  bottomsheet:{
    backgroundColor: 'rgba(50,50,50,.95)',
    borderWidth: 0,
    borderColor: 'white',
  }
});
