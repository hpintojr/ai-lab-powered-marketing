param(
  [Parameter(Mandatory)][string]$Output,
  [Parameter(Mandatory)][string]$LogoPath
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$palette = @{
  bg = [Drawing.ColorTranslator]::FromHtml('#071426')
  light = [Drawing.ColorTranslator]::FromHtml('#122E4E')
  card = [Drawing.ColorTranslator]::FromHtml('#163553')
  cyan = [Drawing.ColorTranslator]::FromHtml('#65E0F4')
  white = [Drawing.ColorTranslator]::FromHtml('#F7FAFF')
  muted = [Drawing.ColorTranslator]::FromHtml('#C1D8EC')
}
$logo = [Drawing.Image]::FromFile($LogoPath)
function Text($value, $size, $color, $x, $y, $width, $height, $bold = $false, $center = $false) {
  $weight = if ($bold) { [Drawing.FontStyle]::Bold } else { [Drawing.FontStyle]::Regular }
  $font = [Drawing.Font]::new('Segoe UI', [single]$size, $weight, [Drawing.GraphicsUnit]::Pixel)
  $brush = [Drawing.SolidBrush]::new($palette[$color])
  $format = [Drawing.StringFormat]::new()
  if ($center) { $format.Alignment = [Drawing.StringAlignment]::Center }
  $format.LineAlignment = [Drawing.StringAlignment]::Center
  $script:g.DrawString($value, $font, $brush, [Drawing.RectangleF]::new($x,$y,$width,$height),$format)
  $font.Dispose()
  $brush.Dispose()
  $format.Dispose()
}
function Rect($color, $x, $y, $width, $height) {
  $brush = [Drawing.SolidBrush]::new($palette[$color])
  $script:g.FillRectangle($brush, [Drawing.RectangleF]::new($x,$y,$width,$height))
  $brush.Dispose()
}
$scenes = @(
  @{ lead='2002'; title='Every town had a computer guy'; cards=@('Computers','Email','Networks'); note='Local businesses needed someone to put it all together.' },
  @{ lead='THE NEXT WAVE'; title='AI is that moment again'; cards=@('Answer calls','Book appointments','Follow up'); note='Three jobs local businesses can put AI to work on.' },
  @{ lead='ADOPTION GAP'; title='Fewer than one in five'; cards=@('1','2','3','4','5'); note='AI adoption among small businesses, as stated in the campaign.' },
  @{ lead='THE MERCURY OFFER'; title='Mercury builds and runs it'; cards=@('Mercury builds','Mercury operates','You own the agency'); note='You own 100% of the business from day one.' },
  @{ lead='OWN THE BUSINESS'; title='Review the pipeline'; cards=@('5 to 10 hours / week','From $20,000'); note='' },
  @{ lead='CLOSING'; title='Book a call to learn more'; cards=@(); note="We'll walk you through exactly how it builds. No pressure, just clarity." }
)
$formats = @(
  @{ name='youtube'; w=1920; h=1080 },
  @{ name='vertical'; w=1080; h=1920 },
  @{ name='linkedin'; w=1080; h=1350 }
)
try {
  foreach ($format in $formats) {
    $w=$format.w
    $h=$format.h
    $isWide=$w -gt $h
    $scale=[Math]::Min($w/1080, $h/1125)
    $left=$w*.11
    $width=$w*.78
    $dir=Join-Path $Output $format.name
    [IO.Directory]::CreateDirectory($dir) | Out-Null
    for ($index=0; $index -lt $scenes.Count; $index++) {
      $scene=$scenes[$index]
      $bmp=[Drawing.Bitmap]::new($w,$h)
      $script:g=[Drawing.Graphics]::FromImage($bmp)
      $script:g.SmoothingMode=[Drawing.Drawing2D.SmoothingMode]::AntiAlias
      $script:g.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $script:g.TextRenderingHint=[Drawing.Text.TextRenderingHint]::AntiAliasGridFit
      $gradient=[Drawing.Drawing2D.LinearGradientBrush]::new([Drawing.Rectangle]::new(0,0,$w,$h),$palette.light,$palette.bg,[single]68)
      $script:g.FillRectangle($gradient,0,0,$w,$h)
      $gradient.Dispose()

      if ($index -eq $scenes.Count-1) {
        $markWidth=[Math]::Min($w*.70,710*$scale)
        $markHeight=$markWidth*$logo.Height/$logo.Width
        $script:g.DrawImage($logo, [Drawing.RectangleF]::new([single](($w-$markWidth)/2),[single]($h*.22),[single]$markWidth,[single]$markHeight))
        Text $scene.title (65*$scale) 'white' $left ($h*.38) $width ($h*.13) $true $true
        $buttonWidth=480*$scale
        Rect 'cyan' (($w-$buttonWidth)/2) ($h*.525) $buttonWidth (96*$scale)
        Text 'Book a strategy call' (40*$scale) 'bg' (($w-$buttonWidth)/2) ($h*.525) $buttonWidth (96*$scale) $true $true
        Text $scene.note (34*$scale) 'muted' $left ($h*.63) $width ($h*.15) $false $true
      } else {
        Rect 'cyan' $left ($h*.155) (66*$scale) (6*$scale)
        Text $scene.lead (38*$scale) 'cyan' $left ($h*.172) $width ($h*.07) $true
        Text $scene.title (92*$scale) 'white' $left ($h*.24) $width ($h*.22) $true
        $gap=18*$scale
        $cols=if ($index -eq 2 -or $isWide) { $scene.cards.Count } else {1}
        $cellWidth=($width-$gap*($cols-1))/$cols
        $cellHeight=if ($cols -eq 1) { $h*.064 } else { $h*.108 }
        for ($i=0; $i -lt $scene.cards.Count; $i++) {
          $x=$left+($cellWidth+$gap)*($i%$cols)
          $y=$h*.49+($cellHeight+$gap)*[Math]::Floor($i/$cols)
          $highlight=$index -eq 2 -and $i -eq 0
          $tile=if($highlight){'cyan'}else{'card'}
          $ink=if($highlight){'bg'}else{'white'}
          Rect $tile $x $y $cellWidth $cellHeight
          Text $scene.cards[$i] (38*$scale) $ink ($x+8) $y ($cellWidth-16) $cellHeight $true $true
        }
        if ($scene.note) {
          $noteY=$h*.49+($cellHeight+$gap)*[Math]::Ceiling($scene.cards.Count/$cols)+8
          Text $scene.note (30*$scale) 'muted' $left $noteY $width ($h*.064)
        }
      }
      $bmp.Save((Join-Path $dir ("scene-{0}.png" -f $index)), [Drawing.Imaging.ImageFormat]::Png)
      $script:g.Dispose()
      $bmp.Dispose()
    }
  }
} finally {
  $logo.Dispose()
}
