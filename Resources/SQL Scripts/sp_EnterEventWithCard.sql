USE [TotalControl_WASCC]
GO

/****** Object:  StoredProcedure [dbo].[sp_EnterEventWithCard]    Script Date: 06/07/2020 10:36:19 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_EnterEventWithCard]
	@DeviceID int,
	@EventID int,
	@CardNumber VarChar(20),
	@Result nvarchar(max)
AS
BEGIN
	set @Result ='{"Result":0,"Reason":"Failed"}';

	declare @ResultCount int = 0;
	declare @CardTypeName varChar(100) = '';
	declare @PatronName varChar(100) = '';
	

	select @CardTypeName = CT.CardTypeName, @PatronName = P.DisplayName from teaPatronCard PC 
	  LEFT JOIN teaPatron P on PC.PatronID = P.PatronID 
      LEFT JOIN teaCardType CT on PC.CardTypeID = CT.CardTypeID
	  where PC.CardNumber = @CardNumber;

	select @ResultCount = count(*) from teaPatronCard PC 
				LEFT JOIN teaPatron P on PC.PatronID = P.PatronID
				LEFT JOIN teaCardType CT on PC.CardTypeID = CT.CardTypeID
				LEFT JOIN teaEventPatron EP on P.PatronID = EP.PatronID
				LEFT JOIN teaEventRole ER on ER.EventRoleID = EP.EventRoleID
				LEFT JOIN teaEventRoleCardType ERCT on ct.CardTypeID = ERCT.CardTypeID
				where PC.CardNumber = @CardNumber and EP.EventID = @EventID and ERCT.EventRoleID = ER.EventRoleID


	if(select count(*) from teaDevice where DeviceID = @DeviceID)>0
	begin
		if(select count(*) from teaEvent where EventID = @EventID)>0
		begin
		  if(select count(*) from teaPatronCard where CardNumber = @CardNumber and Active = 1)>0
		  begin
		    if(@ResultCount) > 0 
			begin
			   if (select  EntryDateTime from teaEventPatron where EventID = @EventID and PatronID = (select PatronID from teaPatronCard where CardNumber = @CardNumber)) is null
			   begin
				 set @Result ='{"Result":1,"Reason":"Entry OK"}';
				 Update teaEventPatron set EntryDateTime = getDate() where EventID = @EventID and PatronID = (select PatronID from teaPatronCard where CardNumber = @CardNumber);
			   end
			   else
			   begin
				 set @Result ='{"Result":1,"Reason":"Entry OK, but Card Number '+@CardNumber+' has previously entered this event"}';
			   end;
			end
			else
			begin
			  set @Result ='{"Result":0,"Reason":"The card type of '+@CardTypeName+' is invalid for this event, for the patron ('+@PatronName+')"}';
			end
		  end
		  else
		  begin
			set @Result ='{"Result":0,"Reason":"Card Number "'+@CardNumber+' is invalid or inactive"}';
		  end
		end
		else
		begin
			set @Result ='{"Result":0,"Reason":"Invalid Event ID :'+convert(varchar,@EventID)+'"}';
		end
	end
	else
	begin
	  set @Result ='{"Result":0,"Reason":"Invalid Device ID :'+convert(varchar,@DeviceID)+'"}';
	end;

	select @Result
END
GO


