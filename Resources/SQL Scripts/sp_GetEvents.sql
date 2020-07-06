USE [TotalControl_WASCC]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetEvents]    Script Date: 06/07/2020 10:36:01 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetEvents]
AS
BEGIN
  Select EventID, EventName from teaEvent where Convert(date,StartDate) >= Convert(date,GetDate()) order by StartDate For JSON PATH, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES;
END
GO


