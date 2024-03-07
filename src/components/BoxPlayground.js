import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import colors from '../styles/colors'
import media from '../styles/media'
import text from '../styles/text'
import getPosition from '../utils/getPosition'
import DeleteTool from '../images/graphTools/DeleteTool.js'
import EditTool from '../images/graphTools/EditTool.js'
import ResetTool from '../images/graphTools/ResetTool.js'
import UndoTool from '../images/graphTools/UndoTool.js'
import VectorGrid from '../images/graphTools/VectorGrid.jpg'
import { Line } from './Line'
import { getDistance } from '../utils/getDistance'
import { getAngle } from '../utils/getAngle'
import { getSlope } from '../utils/getSlope'
import getMedia from '../utils/getMedia'
import useMedia from '../utils/useMedia.js'
import { gsap } from 'gsap'
const BoxPlayground = () => {
  const [currentY, setCurrentY] = useState('250')
  const [currentX, setCurrentX] = useState('250')
  const [indicX, setIndicX] = useState('52%')
  const [indicY, setIndicY] = useState('48%')
  const [lineStart, setLineStart] = useState({ x: '', y: '' })
  const [lineEnd, setLineEnd] = useState({ x: '', y: '' })
  const [elements, setElements] = useState([])
  const [toolActive, setToolActive] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [isHover, setIsHover] = useState(false)
  const [currentSelection, setCurrentCollection] = useState([])
  const [activeElementIndex, setIsActiveElementIndex] = useState([])
  const [recentlyDeleted, setRecentlyDeleted] = useState([])
  const [totalIsReady, setTotalIsReady] = useState(false)
  const [sliderValue, setSliderValue] = useState(9)
  const [controlValues, setControlValues] = useState('')
  useEffect(() => {
    const values = getMedia('45%', '32%', '32%', '32%')
    setControlValues(values)
  }, [])

  const [setX, setSetX] = useState({
    x1: '',
    x2: '',
  })
  const [setY, setSetY] = useState({
    y1: '',
    y2: '',
  })

  const handleClick = (e) => {
    const newEl = { x: currentX, y: currentY }
    return createElement(newEl)
  }
  const handleSliderChange = (event) => {
    setSliderValue(event.target.value)
  }
  const createElement = (elPosition) => {
    const newElement = {
      id: elements.length + 1,
      content: { x: elPosition.x, y: elPosition.y },
      position: {
        x: elPosition.x - 11 / 2,
        y: elPosition.y - 11 / 2,
      },
    }
    setElements((prevElements) => [...prevElements, newElement])
  }
  const handleOnBoundryMove = (e) => {
    if (isActive) {
      return
    }
    const positions = getPosition(e)
    setCurrentY(`${positions.y}`)
    setCurrentX(`${positions.x}`)
    setIndicX(`${positions.y - getMedia(-108, -83, -68, -5)}px`)
    setIndicY(`${positions.x - getMedia(-60, -42, -35, -5)}px`)
  }
  const handleOnBoundryLeave = () => {
    setCurrentX('250')
    setCurrentY('250')
    setIndicX('50.5%')
    setIndicY('48%')
  }
  const handleIsSelected = (e, index) => {
    if (totalIsReady) {
      setTotalIsReady(false)
      setSetX({ x1: '', x2: '' })
      setSetY({ y1: '', y2: '' })
      setIsHover(false)
      setLineStart({ x: '', y: '' })
      setLineEnd({ x: '', y: '' })
      setCurrentCollection([])
      setIsActiveElementIndex([])
      return
    }
    setIsActiveElementIndex((prev) => [...prev, index])
    let x = e.target.attributes.valuex.value
    let y = e.target.attributes.valuey.value
    if (setX.x1 === '' && setY.y1 === '') {
      setSetX((prev) => ({ ...prev, x1: x }))
      setSetY((prev) => ({ ...prev, y1: y }))
      setLineStart({ x: x, y: y })
    } else {
      setSetX((prev) => ({ ...prev, x2: x }))
      setSetY((prev) => ({ ...prev, y2: y }))
      setLineEnd({ x: x, y: y })
      setTotalIsReady(true)
    }

    setCurrentCollection((prev) => [...prev, { x, y }])
    setIsHover(true)
  }

  const deleteLast = () => {
    if (totalIsReady) {
      setLineStart({ x: '', y: '' })
      setLineEnd({ x: '', y: '' })
    }
    let updatedElements = [...elements]
    if (updatedElements.length > 0) {
      setCurrentCollection([])
      setIsActiveElementIndex([])
      let deleted = updatedElements.pop()
      setRecentlyDeleted((prev) => [...prev, deleted])
      setElements(updatedElements)
    }
  }
  const redo = () => {
    let deletedElements = [...recentlyDeleted]
    if (deletedElements.length > 0) {
      let reDoELement = deletedElements.pop()
      setElements((prev) => [...prev, reDoELement])
      setRecentlyDeleted(deletedElements)
    }
  }
  const resetAll = () => {
    setElements([])
    setRecentlyDeleted([])
    setLineEnd({ x: '', y: '' })
    setLineStart({ x: '', y: '' })
    setIsActive(false)
    setCurrentCollection([])
    setIsActiveElementIndex([])
    setTotalIsReady(false)
    setSetX({ x1: '', x2: '' })
    setSetY({ y1: '', y2: '' })
  }
  const handleToolEnter = (e) => {
    console.log(e.target.id)
    if (e.target.id === 'Layer_1Reset' || e.target.id === 'resetTarget') {
      gsap.fromTo(
        `#Layer_1Reset`,
        { rotate: 0 },
        {
          rotate: 360,
          transformOrigin: '50% 50%',
          duration: 1.5,
          ease: 'back.out',
        },
      )
    }
  }
  const runElements = elements.map((element, index) => {
    return (
      <NewElement
        key={index}
        $size={sliderValue}
        onClick={(e) => handleIsSelected(e, index)}
        $active={isActive}
        $isindexed={activeElementIndex.includes(index)}
        valuex={element.content.x}
        valuey={element.content.y}
        $top={element.position.y}
        $left={element.position.x}
      />
    )
  })

  return (
    <Wrapper>
      <BoundryWrapper>
        <ReaderContainer>
          <Reader>
            {!isActive
              ? `X : ( ${currentX} ) , Y : ( ${currentY} ) `
              : 'Selection Mode '}
          </Reader>
        </ReaderContainer>
        <Boundry
          onMouseMove={(e) => handleOnBoundryMove(e)}
          onMouseLeave={(e) => handleOnBoundryLeave(e)}
          onMouseDown={(e) => !isActive && handleClick(e)}
          $active={isActive}
        >
          {runElements}
          {isHover &&
            currentSelection.map((item, index) => {
              return (
                <ClickedPosition $top={item.x} $left={item.y}>
                  {index === 0 ? (
                    <span style={{ color: colors.primaryOrange }}> ( A )</span>
                  ) : (
                    <span style={{ color: colors.primaryOrange }}> ( B )</span>
                  )}
                </ClickedPosition>
              )
            })}
          {lineStart.x !== '' && lineEnd.x !== '' && (
            <Line start={lineStart} end={lineEnd} />
          )}
          <XAxis $top={`${currentY}`} />
          <YAxis $left={`${currentX}`} />
        </Boundry>
        <XandYLetters className='indicX' $topX={`${indicX}`}>
          {'X'}
        </XandYLetters>
        <XandYLetters className='indicY' $topY={`${indicY}`}>
          {'Y'}
        </XandYLetters>
      </BoundryWrapper>
      <ControlPanelDiv>
        <SliderDiv>
          <Span>Tool Width</Span>
          <Slider>
            <SpanEx>{`${sliderValue}px`}</SpanEx>
            <input
              type='range'
              min='4'
              max='17'
              value={sliderValue}
              onChange={handleSliderChange}
              id='slider'
            ></input>
            <ElExample $size={sliderValue} />
          </Slider>
        </SliderDiv>
        <MiddleControlPanelDiv>
          <Controls $topValues={controlValues}>
            <Toggle onClick={() => setIsActive(!isActive)}>
              edit <EditTool widths={'100%'} heights={'100%'} />
            </Toggle>
            <Toggle
              id={'resetTarget'}
              onClick={() => resetAll()}
              active={toolActive}
              onMouseEnter={(e) => handleToolEnter(e)}
            >
              reset{' '}
              <ResetTool id={'resetTool'} widths={'100%'} heights={'100%'} />
            </Toggle>
            <Toggle onClick={() => deleteLast()}>
              delete <DeleteTool widths={'100%'} heights={'100%'} />
            </Toggle>
            <Toggle onClick={() => redo()}>
              redo <UndoTool widths={'100%'} heights={'100%'} />
            </Toggle>
          </Controls>
          <PositionsSetWrapper>
            <NumberSet>
              <Span $underline={true}>Position A:</Span>
              {setX.x1 !== '' && setY.y1 !== '' ? (
                <PositionReadDiv>
                  <SpannedText $color={'#CD3B30'}>
                    X : {`(${setX.x1} px) ,`}
                  </SpannedText>
                  <SpannedText $color={'#005CC8'}>
                    Y : {`(${setY.y1} px)`}
                  </SpannedText>
                </PositionReadDiv>
              ) : (
                <SpannedText $color={'gray'}>select start point</SpannedText>
              )}
            </NumberSet>

            <NumberSet>
              <Span $underline>Position B:</Span>
              {setX.x2 !== '' && setY.y2 !== '' ? (
                <PositionReadDiv>
                  <SpannedText $color={'#CD3B30'}>
                    X : {`(${setX.x2} px) ,`}
                  </SpannedText>

                  <SpannedText $color={'#005CC8'}>
                    Y : {`(${setY.y2} px)`}
                  </SpannedText>
                </PositionReadDiv>
              ) : (
                <SpannedText $color={'gray'}>select start point</SpannedText>
              )}
            </NumberSet>
          </PositionsSetWrapper>

          <TotalsDiv>
            <Calculation>
              <Span $color={`white`} $result={true}>
                Distance:
              </Span>

              {totalIsReady && (
                <>
                  <Results>
                    <Span $color={`#00FF41`}>
                      {' '}
                      {`(  ${getDistance(
                        setX.x1,
                        setY.y1,
                        setX.x2,
                        setY.y2,
                      )} px )`}
                    </Span>
                  </Results>
                </>
              )}
            </Calculation>
            <Calculation>
              <Span $result={true} $color={`white`}>
                Angle:
              </Span>
              {totalIsReady && (
                <Results>
                  {`( ${getAngle(setX.x1, setY.y1, setX.x2, setY.y2)} °)`}
                </Results>
              )}
            </Calculation>
            <Calculation>
              <Span $result={true} $color={'white'}>
                Slope:
              </Span>

              {totalIsReady && (
                <Results>
                  {`(${getSlope(setX.x1, setY.y1, setX.x2, setY.y2)}%)`}
                </Results>
              )}
            </Calculation>
          </TotalsDiv>
        </MiddleControlPanelDiv>
      </ControlPanelDiv>
    </Wrapper>
  )
}

export default BoxPlayground
const SpanEx = styled.p`
  ${text.bodyMBold}
  color:${colors.white};
  margin: unset;
  box-sizing: border-box;
  min-width: 35px;
  text-align: center;
`
const ElExample = styled.div.attrs((props) => ({
  style: {
    width: `${props.$size}px`,
    height: `${props.$size}px`,
  },
}))`
  position: absolute;
  left: 105%;
  color: black;
  border-radius: 50px;
  border: 2px solid black;
`
const Slider = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
`
const SliderDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`
const Toggle = styled.button`
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  text-align: center;
  background-color: rgb(0, 0, 15);
  align-items: center;
  justify-content: center;
  ${text.bodySBold}
  letter-spacing: .2ch;
  color: white;
  margin: unset;
  border-radius: 25%;
  height: 6vw;
  width: 6vw;
  padding: 0.3vw 0vw;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(0.95);
    -webkit-box-shadow: inset 0px 0px 15px 0px rgba(0, 0, 0, 0.43);
    box-shadow: inset 0px 0px 15px 0px rgba(0, 0, 0, 0.43);
    border: 3px inset black;
  }
  ${media.fullWidth} {
    border-radius: 15px;
    top: 0vw;
    height: 72px;
    width: 86px;
  }

  ${media.tablet} {
  }

  ${media.mobile} {
  }
`
const Controls = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: center;
  justify-content: space-evenly;
  text-align: center;
  flex-wrap: wrap;
  -webkit-box-shadow: -1px 5px 15px -3px #000000;
  box-shadow: -1px 5px 15px -3px #000000;
  background-color: #2f3334;
  border: 3px solid rgb(0, 2, 30);
  border-radius: 15px;
  padding: 1.4vw 0.3vw;
  height: 150px;
  gap: 0vw;
  width: 80%;
  ${media.fullWidth} {
    padding: 29px 0px;
    max-height: 300px;
    gap: 6px;
    right: -55px;
    width: 100px;
  }

  ${media.tablet} {
  }

  ${media.mobile} {
  }
`
const NewElement = styled.span.attrs((props) => ({
  style: {
    top: props.$top,
    left: props.$left,
    pointerEvents: props.$active ? 'visible' : 'none',
    backgroundColor: props.$isindexed ? `${colors.primaryOrange}` : '#0CFF40',
    border: props.$isindexed ? `3px solid #EEE352` : `3px solid #0CFF40`,
    height: `${props.$size}px`,
    width: `${props.$size}px`,
    cursor: props.$active ? 'pointer' : 'auto',
  },
}))`
  display: flex;
  align-self: center;
  justify-self: center;
  position: absolute;
  margin: unset;
  justify-self: center;
  border-radius: 50px;
  border: 3px solid #005cc8;
  z-index: -1;
  background-color: ${(props) =>
    props.$isHover ? `${colors.primaryOrange}` : 'transparent'};
  transition: transform 0.3s ease-in-out;
  &:hover {
    background-color: green !important;
    transform: scale(1.2);
  }
`
const ClickedPosition = styled.p.attrs((props) => ({
  style: {
    top: `${props.$left - -8}px`,
    left: `${props.$top - 10}px`,
  },
}))`
  pointer-events: none;
  ${text.bodyMBold}
  position: absolute;
  margin: unset;
  color: black;
`
const Results = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  ${text.h4};
`
const Calculation = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 100%;
  min-width: 100%;
  padding: 15px;
  gap: 5px;
  ${text.bodyMBold};
  color: ${colors.primaryTeal};
`
const TotalsDiv = styled.div`
  position: absolute;
  bottom: 3%;
  display: flex;
  flex-direction: column;
  background-color: #2f3334;
  border: 3px double ;
  max-width: 90%;
  min-width: 90%;
  align-self: center;
  border-radius: 15px;
  padding:10px 0px;
`
const Span = styled.h4.attrs((props) => ({
  style: {
    color: props.$color ? `${props.$color}` : `white`,
    textDecoration: props.$underline ? 'underline' : 'none',
  },
}))`
  position: relative;
  ${text.h4}
  margin:unset;
  color: #3e3852;
  align-self: center;
  justify-self: center;
  z-index: 100;
`
const NumberSet = styled.p`
  ${text.bodyMBold}
  margin:unset;
  color: red;
  span {
    text-indent: 50px;
  }
`
const SpannedText = styled.p`
  ${text.bodyMBold}
  margin: unset;
  color: ${(props) => props.$color};
`
const PositionReadDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 1.389vw;
  ${media.fullWidth} {
    padding-left: 20px;
  }

  ${media.tablet} {
  }

  ${media.mobile} {
  }
`
const PositionsSetWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 15px;
  padding: 10px;
  align-self: center;
  background-color: #2f3334;
  border: 3px solid #16171E;
  width: 100%;
`
const MiddleControlPanelDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.736vw;
  width: 100%;
`
const ControlPanelDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at 50% 30%, rgb(0, 2, 12) 0%, rgb(64, 64, 64) 90.2%);
  align-items: center;
  justify-content: start;
  width: 21.833vw;
  border-radius: 25px;
  padding: 25px;
  padding-top: 40px;
  height: 48.667vw;
  ${media.fullWidth} {
  }

  ${media.tablet} {
  }

  ${media.mobile} {
  }
`
const Reader = styled.div`
  padding: 0.694vw;
  ${text.bodySBold}
  color:#00FF41;
  letter-spacing: 1px;
  width: 90%;
  align-items: center;
  justify-content: center;
  text-align: center;
`
const ReaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  box-sizing: border-box;
  background-color: #2f3334;
  width: 22.889vw;
  border: 0.278vw outset #3e3852;
  -webkit-box-shadow: -0.069vw 0.347vw 1.042vw -0.208vw #000000;
  box-shadow: -0.069vw 0.347vw 1.042vw -0.208vw #000000;
  margin-bottom: 1.389vw;
  border-radius: 1.042vw;
  ${media.fullWidth} {
    width: 330px;
    border: 4px outset #3e3852;
    -webkit-box-shadow: -1px 5px 15px -3px #000000;
    box-shadow: -1px 5px 15px -3px #000000;
    margin-bottom: 20px;
    border-radius: 15px;
  }

  ${media.tablet} {
  }

  ${media.mobile} {
  }
`
const XandYLetters = styled.h2.attrs((props) => ({
  style: {
    top: props.$topX ? `${props.$topX}` : `94%`,
    left: props.$topY ? `${props.$topY}` : '0%',
    color: props.$topY ? '#EA4335' : `${colors.primaryBlue}`,
  },
}))`
  pointer-events: none;
  position: absolute;
  margin: unset;
  ${text.h2}
`

const YAxis = styled.span.attrs((props) => ({
  style: {
    left: props.$left ? `${props.$left}px` : '50%',
  },
}))`
  pointer-events: none;
  position: absolute;
  background-color: ${colors.primaryYellow};
  z-index: 100;
  height: 100%;

  opacity: 80%;
  width: 0.139vw;
  ${media.fullWidth} {
    width: 2px;
  }

  ${media.tablet} {
  }

  ${media.mobile} {
  }
`

const XAxis = styled.span.attrs((props) => ({
  style: {
    top: props.$top ? `${props.$top}px` : '50%',
  },
}))`
  pointer-events: none;
  position: absolute;
  background-color: ${colors.primaryYellow};
  opacity: 80%;
  width: 100%;
  height: 0.2vw;
  border-radius: 50px;
  z-index: 100;
  ${media.fullWidth} {
    height: 2px;
  }

  ${media.tablet} {
  }

  ${media.mobile} {
  }
`
const BoundryWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  padding: 4.5vw;
  ${media.fullWidth} {
    padding: 72px;
  }

  ${media.tablet} {
  }

  ${media.mobile} {
  }
`
const Boundry = styled.div.attrs((props) => ({
  style: {
    backgroundColor: props.$active ? '	#585858' : '	#000000',
  },
}))`
  position: relative;
  display: flex;
  background: url(${VectorGrid});
  background-position: center;
  background-repeat: no-repeat;
  background-size: fill;
  background-blend-mode: lighten;
  overflow: hidden;
  background-color: transparent;
  width: 500px;
  height: 500px;
  border-radius: 1vw;
  outline: 0.2vw outset black;
  box-sizing: border-box;
  z-index: 1;
  ${media.fullWidth} {
    width: 500px;
    height: 500px;
  }

  ${media.tablet} {
  }

  ${media.mobile} {
  }
`
const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 2.944vw 0vw;
  z-index: 1;
  ${media.fullWidth} {
    padding: 0px 0px;
  }

  ${media.tablet} {
  }

  ${media.mobile} {
  }
`
