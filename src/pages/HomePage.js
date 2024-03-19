import React from 'react'
import CustomCarousel from '../components/CustomCarousel'
import LogosContainer from '../components/LogosContainer'
import NavigationBar from '../components/NavigationBar'
import GridLayout from '../components/GridLayout'
import IphoneCTA from '../components/IphoneCTA'
const HomePage = ({ scrollto }) => {
  return (
    <>
      <NavigationBar />
      <CustomCarousel scrollto={scrollto} />
      <LogosContainer scrollto={scrollto} />
      <IphoneCTA/>
      <GridLayout/>
    </>
  )
}

export default HomePage
