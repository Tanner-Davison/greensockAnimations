import React, { useEffect, useState } from "react";
import styled from "styled-components";
import media from "../styles/media";
import colors from "../styles/colors";
import text from "../styles/text";
import { logoArray } from "../images/logos/logoArray";
import { gsap } from "gsap";
import { GlobalLinkButton } from "./Buttons/Buttons";

const LogosContainer = () => {
  const [visibleDiv, setVisibleDiv] = useState([]);
  const [isHover, setIsHover] = useState(false);

  const handleMouseOver = (e) => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const handleSlideUp = (contentId) => {
    setVisibleDiv([...visibleDiv, contentId]);
    const contentDiv = document.getElementById(`${contentId}`);
    return gsap.to(contentDiv, { yPercent: 0, zIndex: 2, duration: 0.4 });
  };
  const handleSlideDown = (contentId) => {
    if (visibleDiv.includes(contentId)) {
      setVisibleDiv(visibleDiv.filter((id) => id !== contentId));
      const reset = document.getElementById(`${contentId}`);
      return gsap.to(reset, { yPercent: 102, zIndex: -1, duration: 0.4 });
    }
  };
  useEffect(() => {
    const slider = document.querySelectorAll(".slideUpDiv");
    gsap.set(slider, { yPercent: 102, zIndex: -1 });
  }, []);

  const logos = logoArray.map((image) => {
    
    let round =
      image.id % 55 === 1 ||
      Number(image.id) === 10 ||
      Number(image.id) === 7 ||
      Number(image.id) === 4
    return (
      <ImageBox
        id={'imageBoxUnique'}
        $round={round}
        onMouseOver={() => handleSlideUp(image.id)}
        onMouseLeave={() => handleSlideDown(image.id)}
        key={image.img}>
        <Image src={image.img} alt={image.img} />
        <SlideUpDiv id={image.id} className={"slideUpDiv"}>
          <SlideHeadline>{image.Header}</SlideHeadline>
          <SlideBody>{image.Body}</SlideBody>
          <GlobalLinkButton
            onMouseOver={() => handleMouseOver()}
            onMouseLeave={() => handleMouseLeave()}
            isHover={isHover}
            align={"right"}
            color={`${colors.primaryOrange}`}>
            Learn More
          </GlobalLinkButton>
        </SlideUpDiv>
      </ImageBox>
    );
  });
  return (
    <Wrapper>
      <AllImagesDiv>{logos}</AllImagesDiv>
    </Wrapper>
  );
};

export default LogosContainer;

const SlideBody = styled.p`
  position: relative;
  ${text.bodyM};
  color: ${colors.white};
  margin: unset;
  padding-left: 5%;
  
  ${media.mobile} {
  ${text.bodyS}
  }
`;
const SlideHeadline = styled.h4`
  ${text.h4};
  color: ${colors.primaryOrange};
  margin: unset;
  margin-left: 0.347vw;
  ${media.mobile}{
    ${text.h4Mobile}
    margin-left:1.2vw;
  }
`;
const SlideUpDiv = styled.div`
  cursor: default;
  position: absolute;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  text-align: left;
  background-color: rgba(0, 0, 0, 1);
  transition: background-color 0.3s ease;
  border-top-right-radius: 1.042vw;
  border-top-left-radius: 1.042vw;
  padding: 0.417vw;
  z-index: 0;
  ${media.fullWidth} {
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
    padding: 6px;
  }

  ${media.tablet} {
    border-top-right-radius: 1.465vw;
    border-top-left-radius: 1.465vw;
    padding: 0.586vw;
  }

  ${media.mobile} {
    border-top-right-radius: 1.465vw;
    border-top-left-radius: 1.465vw;
    padding: .586vw;
  }
`;
const Image = styled.img`
  transition: transform 0.4s ease-in-out;
  width: 102%;
  height: 102%;
  &:hover {
    transform: scale(1.1);
  }
`;
const ImageBox = styled.div`
  position: relative;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: end;
  overflow: hidden;
  border-radius: ${props=>(props.$round ? '100%': '0.208vw')};
  /* border-radius: 0.208vw; */
  -webkit-box-shadow: 5px 5px 5px 0px #000000, 5px 5px 15px 5px rgba(0, 0, 0, 0);
  box-shadow: 5px 5px 5px 0px #000000, 5px 5px 15px 5px rgba(0, 0, 0, 0);
  width: 17.278vw;
  height: 17.278vw;

  &:hover {
    -webkit-box-shadow: 5px 5px 5px 0px #000000, inset 4px 4px 15px 0px #000000,
      5px 5px 15px 5px rgba(0, 0, 0, 0);
    box-shadow: 5px 5px 5px 0px #000000, inset 4px 4px 15px 0px #000000,
      5px 5px 15px 5px rgba(0, 0, 0, 0);
  }
  ${media.fullWidth} {
    width: 249px;
    height: 249px;
    border-radius: 3px;
  }

  ${media.tablet} {
    width: 25.484vw;
    height: 25.484vw;
    border-radius: 0.293vw;
  }

  ${media.mobile} {
    width: 45.594vw;
    height: 46.484vw;
    border-radius: 0.701vw;
  }
`;
const AllImagesDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  background-color: snow;
  width: 100vw;
  gap: 1.708vw;

  ${media.fullWidth} {
    width: 1440px;
    gap: 25px;
  }

  ${media.tablet} {
    width: 100vw;
    gap: 2.441vw;
  }

  ${media.mobile} {
    width: 100vw;
    gap: 4.673vw 2vw;
  }
`;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 1.806vw;
  
  ${media.fullWidth} {
    padding: 60px 26px;
  }

  ${media.tablet} {
    padding: 6.836vw 4.883vw;
  }

  ${media.mobile} {
    padding: 7.776vw 2.907vw;
  }
`;
