USE [TotalControl_WASCC]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetTransactions]    Script Date: 06/07/2020 10:35:47 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetTransactions]
	@CardNumber varChar(20),
	@DisplayNumber int
AS
BEGIN
  if @DisplayNumber = 0
	set @DisplayNumber = 1;
  select top(@DisplayNumber) * from teaTransaction where CardNumber = @CardNumber order by DateCreated Desc For JSON PATH, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES;
END
GO


