import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	input_string = ''
	ifTrue: boolean = false
	middle_oprator: string
	logical_oprators = ['|', '&']
	logical_oprators_seq = []
	firstString: string
	secondString: string
	middleOpratorPos
	finalOutput

	verify() {
		this.logical_oprators_seq = []
		var temp = this.input_string
		var string_arr = temp.split("")
		for (let i = 0; i < string_arr.length; i++) {
			this.checkLogicalOprator(string_arr[i], i)
		}
		if (this.logical_oprators_seq[this.logical_oprators_seq.length / 2] == '|') {
			this.middle_oprator = 'or'
			var index = temp.indexOf("||");  // Gets the first index where a space occours
			this.firstString = temp.substr(0, this.middleOpratorPos).trim(); // Gets the first part
			this.secondString = temp.substr(this.middleOpratorPos + 2).trim();  // Gets the text part
		}
		else if (this.logical_oprators_seq[this.logical_oprators_seq.length / 2] == '&') {
			this.middle_oprator = 'and'
			var index = temp.indexOf("&&");  // Gets the first index where a space occours
			this.firstString = temp.substr(0, this.middleOpratorPos).trim(); // Gets the first part
			this.secondString = temp.substr(this.middleOpratorPos + 2).trim();  // Gets the text part
		}

		let verifyFirst = this.verifyString(this.firstString)
		let verifySecond = this.verifyString(this.secondString)
		if (verifyFirst == true && verifySecond == true) {
			this.ifTrue = true
			this.getResults()
		}
		else {
			this.ifTrue = false
			this.finalOutput = 'Invalid format'
		}	

	}

	checkLogicalOprator(item, index) {
		if (this.logical_oprators.includes(item)) {
			this.logical_oprators_seq.push(item)
		}
		if (this.logical_oprators_seq.length == 3) {
			this.middleOpratorPos = index
		}
	}
	verifyString(item) {
		let temp = item.split("")
		if (temp[0] == '(' && temp[temp.length - 1] == ")") {
			return true
		}
		else {
			return false
		}
	}
	getResults() {
		var first = this.convertToJason(this.firstString, 1)
		var second = this.convertToJason(this.secondString, 2)
		var completeString = '{"query":{"' + this.middle_oprator + '":[' + first + second + ']}}'
		console.log(completeString)
		this.finalOutput = JSON.parse(completeString)
	}

	convertToJason(item, index) {
		if (index == 1) {
			var closing = ','
		}
		else {
			var closing = ''
		}
		if (item.indexOf("&&") != -1) {
			var oprator = 'and'
			var firstHalf = item.substr(0, item.indexOf("&&")).trim().replace(/\(/g, "")
			var secondHalf = item.substr(item.indexOf("&&") + 2).trim().replace(/\)/g, "")
			var completeString = '{"' + oprator + '":{"' + firstHalf.split("=")[0] + '":' + firstHalf.split("=")[1] + ',"' + secondHalf.split("=")[0] + '":' + secondHalf.split("=")[1] + '}}' + closing
			return completeString
		}
		else {
			var oprator = 'or'
			var firstHalf = item.substr(0, item.indexOf("||")).trim().replace(/\(/g, "")
			var secondHalf = item.substr(item.indexOf("||") + 2).trim().replace(/\)/g, "")
			var completeString = '{"' + oprator + '":{"' + firstHalf.split("=")[0] + '":' + firstHalf.split("=")[1] + ',"' + secondHalf.split("=")[0] + '":' + secondHalf.split("=")[1] + '}}' + closing
			return completeString
		}
	}

}
