
var jsonemployesdetail='{items:[{"id":"1","firstName":"James","lastName":"King","managerId":"0","title":"President and CEO","department":"Corporate","city":"Boston, MA","officePhone":"617-000-0001","cellPhone":"781-000-0001","email":"jking@fakemail.com","picture":"james_king.jpg","managerFirstName":null,"managerLastName":null,"reportCount":"4"},{"id":"2","firstName":"Julie","lastName":"Taylor","managerId":"1","title":"VP of Marketing","department":"Marketing","city":"Boston, MA","officePhone":"617-000-0002","cellPhone":"781-000-0002","email":"jtaylor@fakemail.com","picture":"julie_taylor.jpg","managerFirstName":"James","managerLastName":"King","reportCount":"2"},{"id":"3","firstName":"Eugene","lastName":"Lee","managerId":"1","title":"CFO","department":"Accounting","city":"Boston, MA","officePhone":"617-000-0003","cellPhone":"781-000-0003","email":"elee@fakemail.com","picture":"eugene_lee.jpg","managerFirstName":"James","managerLastName":"King","reportCount":"0"},{"id":"4","firstName":"John","lastName":"Williams","managerId":"1","title":"VP of Engineering","department":"Engineering","city":"Boston, MA","officePhone":"617-000-0004","cellPhone":"781-000-0004","email":"jwilliams@fakemail.com","picture":"john_williams.jpg","managerFirstName":"James","managerLastName":"King","reportCount":"3"},{"id":"5","firstName":"Ray","lastName":"Moore","managerId":"1","title":"VP of Sales","department":"Sales","city":"Boston, MA","officePhone":"617-000-0005","cellPhone":"781-000-0005","email":"rmoore@fakemail.com","picture":"ray_moore.jpg","managerFirstName":"James","managerLastName":"King","reportCount":"2"},{"id":"6","firstName":"Paul","lastName":"Jones","managerId":"4","title":"QA Manager","department":"Engineering","city":"Boston, MA","officePhone":"617-000-0006","cellPhone":"781-000-0006","email":"pjones@fakemail.com","picture":"paul_jones.jpg","managerFirstName":"John","managerLastName":"Williams","reportCount":"0"},{"id":"7","firstName":"Paula","lastName":"Gates","managerId":"4","title":"Software Architect","department":"Engineering","city":"Boston, MA","officePhone":"617-000-0007","cellPhone":"781-000-0007","email":"pgates@fakemail.com","picture":"paula_gates.jpg","managerFirstName":"John","managerLastName":"Williams","reportCount":"0"},{"id":"8","firstName":"Lisa","lastName":"Wong","managerId":"2","title":"Marketing Manager","department":"Marketing","city":"Boston, MA","officePhone":"617-000-0008","cellPhone":"781-000-0008","email":"lwong@fakemail.com","picture":"lisa_wong.jpg","managerFirstName":"Julie","managerLastName":"Taylor","reportCount":"0"},{"id":"9","firstName":"Gary","lastName":"Donovan","managerId":"2","title":"Marketing","department":"Marketing","city":"Boston, MA","officePhone":"617-000-0009","cellPhone":"781-000-0009","email":"gdonovan@fakemail.com","picture":"gary_donovan.jpg","managerFirstName":"Julie","managerLastName":"Taylor","reportCount":"0"},{"id":"10","firstName":"Kathleen","lastName":"Byrne","managerId":"5","title":"Sales Representative","department":"Sales","city":"Boston, MA","officePhone":"617-000-0010","cellPhone":"781-000-0010","email":"kbyrne@fakemail.com","picture":"kathleen_byrne.jpg","managerFirstName":"Ray","managerLastName":"Moore","reportCount":"0"},{"id":"11","firstName":"Amy","lastName":"Jones","managerId":"5","title":"Sales Representative","department":"Sales","city":"Boston, MA","officePhone":"617-000-0011","cellPhone":"781-000-0011","email":"ajones@fakemail.com","picture":"amy_jones.jpg","managerFirstName":"Ray","managerLastName":"Moore","reportCount":"0"},{"id":"12","firstName":"Steven","lastName":"Wells","managerId":"4","title":"Software Architect","department":"Engineering","city":"Boston, MA","officePhone":"617-000-0012","cellPhone":"781-000-0012","email":"swells@fakemail.com","picture":"steven_wells.jpg","managerFirstName":"John","managerLastName":"Williams","reportCount":"0"}]}';


$('#detailsPage').live('pageshow', function(event) {
	var id = getUrlVars()["id"];
	//$.getJSON(serviceURL + 'getemployee.php?id='+id, displayEmployee);
	data = eval('(' + jsonemployesdetail + ')');
	employees = data.items;
	$.each(employees, function(index, employee) {
		if (employee.id==id){
			displayEmployee(employee);		
		}
	});
});

function displayEmployee(data) {
	var employee = data;
	console.log(employee);
	$('#employeePic').attr('src', 'pics/' + employee.picture);
	$('#fullName').text(employee.firstName + ' ' + employee.lastName);
	$('#employeeTitle').text(employee.title);
	$('#city').text(employee.city);
	console.log(employee.officePhone);
	if (employee.managerId>0) {
		$('#actionList').append('<li><a href="employeedetails.html?id=' + employee.managerId + '"><h3>View Manager</h3>' +
				'<p>' + employee.managerFirstName + ' ' + employee.managerLastName + '</p></a></li>');
	}
	if (employee.reportCount>0) {
		$('#actionList').append('<li><a href="reportlist.html?id=' + employee.id + '"><h3>View Direct Reports</h3>' +
				'<p>' + employee.reportCount + '</p></a></li>');
	}
	if (employee.email) {
		$('#actionList').append('<li><a href="mailto:' + employee.email + '"><h3>Email</h3>' +
				'<p>' + employee.email + '</p></a></li>');
	}
	if (employee.officePhone) {
		$('#actionList').append('<li><a href="tel:' + employee.officePhone + '"><h3>Call Office</h3>' +
				'<p>' + employee.officePhone + '</p></a></li>');
	}
	if (employee.cellPhone) {
		$('#actionList').append('<li><a href="tel:' + employee.cellPhone + '"><h3>Call Cell</h3>' +
				'<p>' + employee.cellPhone + '</p></a></li>');
		$('#actionList').append('<li><a href="sms:' + employee.cellPhone + '"><h3>SMS</h3>' +
				'<p>' + employee.cellPhone + '</p></a></li>');
	}
	$('#actionList').listview('refresh');
	
}


