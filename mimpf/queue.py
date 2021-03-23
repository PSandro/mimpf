from math import pow


def calculate_priority(waiting_time: int, target_date_diff: int):
    """
    calculate the priority of an appointment based on
    waiting time (minutes), difference to target date (minutes).

    """
    td_prio = 9 / (pow(1.005, pow(waiting_time, 2))) + 9
    wt_prio = (-6) / (pow(1.009, pow(waiting_time, 2))) + 6
    if target_date_diff > 0:
        wt_prio *= 2
    return td_prio + wt_prio
