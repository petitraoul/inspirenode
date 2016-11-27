
var employees;
var jsonemployes='{"items":[{"id":"10","firstName":"Kathleen","lastName":"Byrne","title":"Sales Representative","picture":"kathleen_byrne.jpg","reportCount":"0"},{"id":"9","firstName":"Gary","lastName":"Donovan","title":"Marketing","picture":"gary_donovan.jpg","reportCount":"0"},{"id":"7","firstName":"Paula","lastName":"Gates","title":"Software Architect","picture":"paula_gates.jpg","reportCount":"0"},{"id":"11","firstName":"Amy","lastName":"Jones","title":"Sales Representative","picture":"amy_jones.jpg","reportCount":"0"},{"id":"6","firstName":"Paul","lastName":"Jones","title":"QA Manager","picture":"paul_jones.jpg","reportCount":"0"},{"id":"1","firstName":"James","lastName":"King","title":"President and CEO","picture":"james_king.jpg","reportCount":"4"},{"id":"3","firstName":"Eugene","lastName":"Lee","title":"CFO","picture":"eugene_lee.jpg","reportCount":"0"},{"id":"5","firstName":"Ray","lastName":"Moore","title":"VP of Sales","picture":"ray_moore.jpg","reportCount":"2"},{"id":"2","firstName":"Julie","lastName":"Taylor","title":"VP of Marketing","picture":"julie_taylor.jpg","reportCount":"2"},{"id":"12","firstName":"Steven","lastName":"Wells","title":"Software Architect","picture":"steven_wells.jpg","reportCount":"0"},{"id":"4","firstName":"John","lastName":"Williams","title":"VP of Engineering","picture":"john_williams.jpg","reportCount":"3"},{"id":"8","firstName":"Lisa","lastName":"Wong","title":"Marketing Manager","picture":"lisa_wong.jpg","reportCount":"0"}]}'; 
 

$('#employeeListPage').bind('pageinit', function(event) {
	getEmployeeList();
});

function getEmployeeList() {
	//$.getJSON(serviceURL + 'getemployees.php', function(data) {
		$('#employeeList li').remove();
		data = eval('(' + jsonemployes + ')');
		employees = data.items;
		$.each(employees, function(index, employee) {
			$('#employeeList').append('<li><a href="employeedetails.html?id=' + employee.id + '">' +
					'<img src="pics/' + employee.picture + '"/>' +
					'<h4>' + employee.firstName + ' ' + employee.lastName + '</h4>' +
					'<p>' + employee.title + '</p>' +
					'<span class="ui-li-count">' + employee.reportCount + '</span></a></li>');
		});
		$('#employeeList').listview('refresh');
	//});
}