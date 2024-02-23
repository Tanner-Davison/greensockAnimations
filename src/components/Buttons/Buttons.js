import React from "react";
/* eslint-disable */
import styled from "styled-components";
import colors from "../../styles/colors";
import text from "../../styles/text";
import media from "../../styles/media";
import { ReactComponent as LeftArrow } from "./svgs/LeftArrow.svg";
import { ReactComponent as RightArrow } from "./svgs/RightArrow.svg";

export const CarouselButtonRight = ({ children, onClick }) => {
  const handleClick = (e) => {
    onClick && onClick(e);
  };
  return (
    <StyledArrow
      id={"rightArrow"}
      as={RightArrow}
      onClick={handleClick}></StyledArrow>
  );
};

export const CarouselButtonLeft = ({ children, onClick }) => {
  const handleClick = (e) => {
    onClick && onClick(e);
  };
  return (
    <StyledArrow
      id={"leftArrow"}
      as={LeftArrow}
      onClick={handleClick}></StyledArrow>
  );
};
export const GlobalLinkButton = ({
  children,
  onClick,
  color,
  bgColor,
  align,
  size,
  onMouseOver,
  onMouseLeave,
  isHover,
}) => {
  const handleClick = (e) => {
    onClick && onClick(e);
  };
  return (
    <GlobalButton
      $hover={isHover}
      size={size}
      onMouseLeave={onMouseLeave}
      onMouseOver={onMouseOver}
      $color={color}
      $align={align}
      $bgcolor={bgColor}
      onClick={handleClick}>
      {children}
      <LinkArrow
        id={"LinkArrow"}
        as={RightArrow}
        $color={color}
        $hover={isHover}
      />
    </GlobalButton>
  );
};

const LinkArrow = styled.svg`
  cursor: pointer;
  display: inline-flex;
  width: 35px;
  padding: 5px 0px;
  stroke: ${(props) => (props.$color ? `${props.$color}` : "black")};
  stroke-width: 2;
  transition: transform 0.3s ease-in-out;
  transform: ${(props) => (props.$hover ? `translateX(5px)` : "unset")};
  ${media.fullWidth} {
    width: 35px;
  }
  
  ${media.tablet} {
    width: 30px;
  }
  
  ${media.mobile} {
    width: 28px;
  }
`;
const GlobalButton = styled.button`
  cursor: pointer;
  position: relative;
  display: flex;
  bottom: 0;
  right: 0px;
  width: 100%;
  align-items: center;
  justify-content: center;
  ${text.bodyMBold}
  background-color: ${(props) => props.$bgcolor ? `${props.$bgcolor}` : "transparent"};
  border: none;
  color: ${(props) => props.$color ? `${props.$color}` : "black"};
  justify-content: ${(props) => props.$align ?` ${props.$align}` : "left"};
  ${media.mobile} {
    ${text.bodySBold}

  }
`;
const StyledArrow = styled.svg`
  cursor: pointer;
  width: 5.208vw;
  padding: 5px;
  height: auto;
  fill: ${colors.primary}; 
  stroke: ${colors.primaryOrange}; 
  stroke-width: 2; 
`;
