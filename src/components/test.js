import React from 'react';
class Test extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			timeStamp:null,
		}
	}
	oninput = (e) =>{
		e.persist()
		this.setState({
			timeStamp:e.timeStamp
		},() => {
			setTimeout(function() {
 	    		console.log("setTimeout",e.timeStamp); 
    		}, 0)
		})
		console.log(e.timeStamp)
		console.log(e.target.value)
	}
	render(){
		return (
		    <div>
		    	<input onInput={this.oninput} />
		    </div>
		);
	}	  
};

// const MyWork = Form.create()(MyWorkCon);

export default Test;