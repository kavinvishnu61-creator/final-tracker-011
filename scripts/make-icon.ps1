Add-Type -AssemblyName System.Drawing

$size = 512
$bmp = New-Object System.Drawing.Bitmap $size, $size
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::Transparent)

# Draw rounded squircle background
$pad = 28
$rect = New-Object System.Drawing.Rectangle $pad, $pad, ($size - 2 * $pad), ($size - 2 * $pad)
$corner = 120

$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddArc($rect.X, $rect.Y, $corner, $corner, 180, 90)
$path.AddArc(($rect.Right - $corner), $rect.Y, $corner, $corner, 270, 90)
$path.AddArc(($rect.Right - $corner), ($rect.Bottom - $corner), $corner, $corner, 0, 90)
$path.AddArc($rect.X, ($rect.Bottom - $corner), $corner, $corner, 90, 90)
$path.CloseFigure()

# Dark sleek gradient fill
$grad = New-Object System.Drawing.Drawing2D.LinearGradientBrush (New-Object System.Drawing.Point 0, 0), (New-Object System.Drawing.Point $size, $size), ([System.Drawing.Color]::FromArgb(255, 20, 26, 38)), ([System.Drawing.Color]::FromArgb(255, 7, 12, 22))
$g.FillPath($grad, $path)

# Subtle outer border
$borderPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(60, 255, 255, 255)), 4
$g.DrawPath($borderPen, $path)

# Outer circle ring
$center = $size / 2
$ringRadius = 144
$ringPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(240, 255, 255, 255)), 22
$g.DrawEllipse($ringPen, [float]($center - $ringRadius), [float]($center - $ringRadius), [float]($ringRadius * 2), [float]($ringRadius * 2))

# Minimalist checkmark in center
$checkPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), 28
$checkPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$checkPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$checkPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

$p1 = New-Object System.Drawing.PointF ([float]($center - 68)), ([float]($center + 8))
$p2 = New-Object System.Drawing.PointF ([float]($center - 16)), ([float]($center + 60))
$p3 = New-Object System.Drawing.PointF ([float]($center + 72)), ([float]($center - 52))

$g.DrawLines($checkPen, @($p1, $p2, $p3))

$targetDir = 'C:\Users\KAVINRAM\.gemini\antigravity\scratch\habit-tracker\public'
$pngPath = Join-Path $targetDir 'icon.png'
$bmp.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)

$iconPath = Join-Path $targetDir 'icon.ico'
$hIcon = $bmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)
$fs = [System.IO.File]::OpenWrite($iconPath)
$icon.Save($fs)
$fs.Close()
$icon.Dispose()

$g.Dispose()
$bmp.Dispose()

Write-Output 'Generated icon.png and icon.ico successfully!'
