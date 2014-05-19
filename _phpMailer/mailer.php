<?php
	
	die;

	// //domain.com/mailer.php?from=XXX&email=XXX&message=XXX
	
	$recipients	= "recipient@domain.com";
	$subject	= "Email Title";
	$from	= "sender@domain.com";
	
	$header = "";
	$header .= "From:" . $from . "\r\n";
    $header .= "Reply-To:" . $from . "\r\n";
   	$header .= "X-Mailer: PHP/" . phpversion();
	$header .= "MIME-Version: 1.0" . "\r\n";
	$header .= "Content-type: text/html; charset=utf-8" . "\r\n";
	// $header .= "Bcc:anotherRecipient@domain.com" . "\r\n";    // optional

	$body = "";


	if (isset($_GET["from"])) {
		$body .= "<b>From</b>: " . $_GET["from"] . "<br />\r\n";
	}
	if (isset($_GET["email"])) {
		$body .= "<b>Contact Info</b>: " . $_GET["email"] . "<br />\r\n";
	}
	if (isset($_GET["message"])) {
		$body .= "<b>Message</b>: " . $_GET["message"] . "<br />\r\n";
	}
	
	$parameters = "-f domain.com";

	
	if(!empty($body)){
		$body = stripslashes($body);
		
		mail($recipients,
				$subject,
				$body,
				$header,
				$parameters);
		
		return true;
	}

?>