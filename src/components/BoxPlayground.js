import React, { useState } from 'react'
import styled from 'styled-components'
import colors from '../styles/colors'
import media from '../styles/media'
import text from '../styles/text'
import getPosition from '../utils/getPosition'
import DeleteTool from '../images/graphTools/DeleteTool.js'
import EditTool from '../images/graphTools/EditTool.js'
import ResetTool from '../images/graphTools/ResetTool.js'
import UndoTool from '../images/graphTools/UndoTool.js'
import { Line } from './Line'
import { getDistance } from '../utils/getDistance'
import { getAngle } from '../utils/getAngle'
import { getSlope } from '../utils/getSlope'
import getMedia from '../utils/getMedia'
import { gsap } from 'gsap'
const BoxPlayground = () => {
  const [currentY, setCurrentY] = useState('250')
  const [currentX, setCurrentX] = useState('250')
  const [indicX, setIndicX] = useState('50.5%')
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
  const [sliderValue, setSliderValue] = useState(8)

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
        { rotate: 260, transformOrigin: '50% 50%' },
      )
    }
  }
  const runElements = elements.map((element, index) => {
    console.log(sliderValue)

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
        <Controls>
          <Toggle onClick={() => setIsActive(!isActive)}>
            edit <EditTool />
          </Toggle>
          <Toggle
            id={'resetTarget'}
            onClick={() => resetAll()}
            active={toolActive}
            onMouseEnter={(e) => handleToolEnter(e)}
          >
            reset{' '}
            <ResetTool id={'resetTool'} widths={'100px'} heights={'100px'} />
          </Toggle>
          <Toggle onClick={() => deleteLast()}>
            delete <DeleteTool />
          </Toggle>
          <Toggle onClick={() => redo()}>
            redo <UndoTool />
          </Toggle>
        </Controls>
        <Reader>
          {!isActive
            ? `X : ( ${currentX} ) , Y : ( ${currentY} ) `
            : 'In edit mode '}
        </Reader>
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
        <Indicator className='indicX' $topX={`${indicX}`}>
          {'X'}
        </Indicator>
        <Indicator className='indicY' $topY={`${indicY}`}>
          {'Y'}
        </Indicator>
      </BoundryWrapper>

      <DisplayCalc>
        <SliderDiv>
          <Span>Tool Width</Span>

          <Slider>
            <SpanEx>{`${sliderValue}px`}</SpanEx>
            <input
              type='range'
              min='1'
              max='17'
              value={sliderValue}
              onChange={handleSliderChange}
              id='slider'
            ></input>
            <ElExample $size={sliderValue} />
          </Slider>
        </SliderDiv>
        <DistanceCalculater>
          <Equation>
            <NumberSet>
              <Span $underline={true}>Position A:</Span>
              {setX.x1 !== '' && setY.y1 !== '' ? (
                <PositionReadDiv>
                  <SpannedText>
                    <span style={{ color: colors.primaryOrange }}>x :</span>
                    {`(${setX.x1} px) ,`}
                    <br></br>
                    <span style={{ color: 'blue' }}>y :</span>
                    {`(${setY.y1} px)`}
                  </SpannedText>
                </PositionReadDiv>
              ) : (
                'select start point'
              )}
            </NumberSet>

            <NumberSet>
              <Span $underline={true}>Position B:</Span>
              {setX.x2 !== '' && setY.y2 !== '' ? (
                <PositionReadDiv>
                  <SpannedText>
                    <span style={{ color: colors.primaryOrange }}>x : </span>
                    {`(${setX.x2} px) ,`}
                  </SpannedText>

                  <SpannedText>
                    <span style={{ color: 'blue' }}>y : </span>
                    {`(${setY.y2} px)`}
                  </SpannedText>
                </PositionReadDiv>
              ) : (
                'select endpoint'
              )}
            </NumberSet>
            <TotalDistance>
              <Span $result={true}>
                Total{' '}
                <span style={{ color: colors.primaryOrange }}> Distance</span>{' '}
                From A to B ={' '}
              </Span>

              {totalIsReady && (
                <>
                  <Results>
                    {`(  ${getDistance(
                      setX.x1,
                      setY.y1,
                      setX.x2,
                      setY.y2,
                    )} px )`}
                  </Results>
                </>
              )}
              <TotalDistance>
                <Span $result={true}>
                  Total{' '}
                  <span style={{ color: colors.primaryOrange }}> Angle</span>{' '}
                  From A to B ={' '}
                </Span>

                {totalIsReady && (
                  <Results>
                    {`( ${getAngle(setX.x1, setY.y1, setX.x2, setY.y2)} °)`}
                  </Results>
                )}
              </TotalDistance>
              <TotalDistance>
                <Span $result={true}>
                  Total{' '}
                  <span style={{ color: colors.primaryOrange }}> Slope</span>{' '}
                  From A to B ={' '}
                </Span>

                {totalIsReady && (
                  <Results>
                    {`( ${getSlope(setX.x1, setY.y1, setX.x2, setY.y2)}%)`}
                  </Results>
                )}
              </TotalDistance>
            </TotalDistance>
          </Equation>
        </DistanceCalculater>
      </DisplayCalc>
    </Wrapper>
  )
}

export default BoxPlayground
const SpanEx = styled.p`
  ${text.bodyMBold}
  color:${colors.grey600};
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
  top: 0px;
  height: 5vw;
  width: 5.972vw;
  padding: 0.3vw 0vw;
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(0.9);
    -webkit-box-shadow: inset 0px 0px 15px 0px rgba(0, 0, 0, 0.43);
    box-shadow: inset 0px 0px 15px 0px rgba(0, 0, 0, 0.43);
    border: 3px solid black;
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
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  -webkit-box-shadow: -1px 5px 15px -3px #000000;
  box-shadow: -1px 5px 15px -3px #000000;
  background-color: #2f3334;
  border: 4px solid #3e3852;
  border-radius: 30px;
  padding: 1.4vw 0.3vw;
  max-height: 34.722vw;
  gap: 0.4vw;
  top: 8.944vw;
  right: -5.819vw;
  width: 6.944vw;
  ${media.fullWidth} {
    padding: 29px 0px;
    max-height: 300px;
    gap: 6px;
    top: 143px;
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
    backgroundColor: props.$isindexed
      ? `${colors.primaryOrange}`
      : 'transparent',
    height: `${props.$size}px`,
    width: `${props.$size}px`,
  },
}))`
  cursor: pointer;
  display: flex;
  align-self: center;
  justify-self: center;
  position: absolute;
  margin: unset;
  justify-self: center;
  border-radius: 50px;
  border: 2px solid black;
  z-index: -1;
  background-color: ${(props) =>
    props.$isHover ? `${colors.primaryOrange}` : 'transparent'};
  &:hover {
    background-color: green;
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
  ${text.h4};
`
const TotalDistance = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10%;
  gap: 10px;
  ${text.bodyMBold};
  color: ${colors.primaryTeal};
`
const Span = styled.h4.attrs((props) => ({
  style: {
    color: props.$result ? `${colors.darkPurple}` : `${colors.primaryPurple}`,
    textDecoration: props.$underline ? 'underline' : 'none',
  },
}))`
  position: relative;
  ${text.h4}
  margin:unset;
  color: ${colors.primaryPurple};
  align-self: center;
  justify-self: center;
  z-index: 100;
`
const NumberSet = styled.p`
  ${text.bodyMBold}
  margin:unset;
  color: black;
  span {
    text-indent: 50px;
  }
`
const SpannedText = styled.p`
  ${text.bodyMBold}
  margin: unset;
`
const PositionReadDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 20px;
`
const Equation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 25px;
  justify-content: start;
  ${text.bodyMBold};
  color: black;
`
const DistanceCalculater = styled.div`
  display: flex;
  flex-direction: column;
`
const DisplayCalc = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  width: 300px;
  border: 2px solid blue;
  padding-top: 40px;
  max-height: 600px;
  height: 600px;
`
const Reader = styled.p`
  ${text.bodyMBold}
`
const Indicator = styled.h2.attrs((props) => ({
  style: {
    top: props.$topX ? `${props.$topX}` : `93%`,
    left: props.$topY ? `${props.$topY}` : '0%',
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
  background-color: black;
  z-index: 100;
  height: 100%;
  width: 0.139vw;
  ${media.fullWidth} {
    width: 0.139vw;
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
  background-color: black;
  width: 100%;
  height: 0.139vw;
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
    backgroundColor: props.$active ? 'lightgray' : 'transparent',
  },
}))`
  position: relative;
  display: flex;
  overflow: hidden;
  background-color: transparent;
  border: 2px solid red;
  width: 500px;
  height: 500px;
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
  flex-direction: row-reverse;
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
