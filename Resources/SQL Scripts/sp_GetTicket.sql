USE [TotalControl_WASCC]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetTicket]    Script Date: 06/07/2020 10:35:53 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetTicket]
	@CardID varchar(20)
AS
BEGIN
  select P.DisplayName from teaPatron P 
	LEFT JOIN teaPatronCard PC on P.PatronID = PC.PatronID
  where PC.CardNumber = @CardID;
END
GO


