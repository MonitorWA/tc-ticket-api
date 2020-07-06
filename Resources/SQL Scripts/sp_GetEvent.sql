USE [TotalControl_WASCC]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetEvent]    Script Date: 06/07/2020 10:36:09 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetEvent]
	@EventID int
AS
BEGIN
	Select * from teaEvent where EventID =  @EventID For JSON PATH, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES;
END
GO


