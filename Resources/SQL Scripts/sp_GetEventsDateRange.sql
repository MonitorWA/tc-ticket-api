USE [TotalControl_WASCC]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetEventsDateRange]    Script Date: 06/07/2020 10:35:57 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetEventsDateRange]
	@StartDate Varchar(20),
	@EndDate Varchar(20)
AS
BEGIN
  DECLARE @dStartDate date;
  DECLARE @dEndDate date;

  BEGIN TRY
	set @dStartDate = Convert(date,RIGHT(@StartDate,4)+'-'+SUBSTRING(@StartDate,4,2)+'-'+LEFT(@StartDate,2));
	set @dEndDate = Convert(date,RIGHT(@EndDate,4)+'-'+SUBSTRING(@EndDate,4,2)+'-'+LEFT(@EndDate,2));
	Select EventID, EventName, StartDate, FinishDate from teaEvent where (Convert(date,StartDate) >= @dStartDate) AND (Convert(date,FinishDate) <= @dEndDate) order by StartDate For JSON PATH, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES;
  END TRY
  BEGIN CATCH
	select 'Error';
  END CATCH;
END
GO


