import React from 'react'
const ResetTool = ({widths, heights}) => {
  return (
    <svg
      fill='#4c558e'
      width={widths}
      height={heights}
      viewBox='0 0 512 512'
      data-name='Layer 1'
      id='Layer_1Reset'
      xmlns='http://www.w3.org/2000/svg'
    //   onMouseEnter={handleOnMouseEnter}  
    //   onMouseLeave={onMouseLeave} 

    >
      <path d='M64,256H34A222,222,0,0,1,430,118.15V85h30V190H355V160h67.27A192.21,192.21,0,0,0,256,64C150.13,64,64,150.13,64,256Zm384,0c0,105.87-86.13,192-192,192A192.21,192.21,0,0,1,89.73,352H157V322H52V427H82V393.85A222,222,0,0,0,478,256Z' />
    </svg>
  )
}
export default ResetTool
