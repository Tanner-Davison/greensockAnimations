import React from 'react'
import CustomCarousel from '../components/CustomCarousel'
import LogosContainer from '../components/LogosContainer'
import NavigationBar from '../components/NavigationBar'
const HomePage = ({ scrollto }) => {
  return (
    <>
      <NavigationBar />
      <CustomCarousel scrollto={scrollto} />
      <LogosContainer scrollto={scrollto} />
    </>
  )
}

export default HomePage