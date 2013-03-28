<?php
class EmulateDateTime extends DateTime
{
    public static $timeModifier = NULL;

    public function __construct($now = 'now', DateTimeZone $timezone = NULL)
    {
        parent::__construct($now);
        if($timezone !== NULL) {
            $this->setTimezone($timezone);
        }
        if(self::$timeModifier !== NULL) {
            $this->modify(self::$timeModifier);
        }
    }
}
?>