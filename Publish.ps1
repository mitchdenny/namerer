function Publish-Package
{
	[CmdletBinding()]
	param($npmusername, $npmpassword, $npmemail)
	
	$setup = "$npmusername`r`n$npmpassword`r`n$npmemail`r`n"
	$setup | npm adduser
}