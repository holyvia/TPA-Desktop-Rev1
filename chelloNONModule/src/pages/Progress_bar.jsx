import React from 'react'
  
const Progress_bar = ({bgcolor,progress,height}) => {
     
    const Parentdiv = {
        height: height,
        width: '100%',
        backgroundColor: 'whitesmoke',
        borderRadius: 40,
        margin: 5
      }
      
      const Childdiv = {
        height: '100%',
        width: `${progress}%`,
        backgroundColor: bgcolor,
       borderRadius:40,
        textAlign: 'right'
      }
      
      const progresstext = {
        padding: 5,
        color: 'black',
        fontWeight: 900
      }
        console.log(progress);
    return (
    <div style={Parentdiv}>
      <div style={Childdiv}>
      </div>
    </div>
    )
}
  
export default Progress_bar;