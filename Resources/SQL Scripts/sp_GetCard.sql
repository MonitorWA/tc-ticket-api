USE [TotalControl_WASCC]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetCard]    Script Date: 06/07/2020 10:36:13 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetCard]
	@CardNumber varChar(20)
AS
BEGIN
  select PC.CardNumber,A.Balance,A.RewardPoints, PC.CardExpiry from teaPatronCard PC 
  LEFT JOIN teaPatronAccount PA on PC.PatronID = PA.PatronID 
  LEFT JOIN teaAccount A on PA.AccountID = A.AccountID
  where CardNumber = @CardNumber For JSON PATH, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES;
END
GO


