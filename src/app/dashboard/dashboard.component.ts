import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Chart } from 'chart.js/auto';
import { ApplicantService } from '../applicant.service';
import { ApplicantData } from '../interfaces';
import { MemberService } from '../member.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // constructor() { }
  public chart: Chart;
  public applicantsCurrentMonth: ApplicantData[];
  public CURRENT_YEAR = new Date().getFullYear();
  public mktMembers: number;
  public tmMembers: number;
  public finMembers: number;
  public ogvMembers: number;
  public ogtMembers: number;
  public igvMembers: number;
  public igtMembers: number;

  public openApplicants: number;
  public interviewedApplicants: number;
  public rejectedApplicants: number;
  public notInterestedApplicants: number;
  public selectedApplicants: number;

  public opensByMonth: number[] = [];
  public selectedByMonth: number[] = [];

  public blue = '#3e95cd';
  public purple = '#8e5ea2';
  public green = '#33FF8C';
  public red = '#FF5733';
  public yellow = '#DEE85A';
  public orange = '#FFBD33';
  public blueOpacity = 'rgba(62, 149, 205, 0.8)';
  public purpleOpacity = 'rgba(142, 94, 162, 0.8)';
  public greenOpacity = 'rgba(51, 255, 140, 0.8)';
  public redOpacity = 'rgba(255, 87, 51, 0.8)';
  public yellowOpacity = 'rgba(222, 232, 90, 0.8)';
  public orangeOpacity = 'rgba(255, 189, 51, 0.8)';

  constructor(
    private applicantService: ApplicantService,
    private memberService: MemberService,
    private snackbar: MatSnackBar
  ) { }
  ngOnInit(): void {
    this.applicantCharts();
    this.memberCharts();
  }

  public applicantCharts() {
    try {
      this.applicantService.getApplicants(false).subscribe(applicants => {
        this.applicantsCurrentMonth = applicants.filter(applicant => {
          return new Date(applicant.createdAt).getMonth() === new Date().getMonth();
        });
        this.openApplicants = this.applicantsCurrentMonth.filter(applicant => applicant.stage === 'open').length;
        this.interviewedApplicants = this.applicantsCurrentMonth.filter(applicant => applicant.stage === 'interviewed').length;
        this.rejectedApplicants = this.applicantsCurrentMonth.filter(applicant => applicant.stage === 'rejected').length;
        this.notInterestedApplicants = this.applicantsCurrentMonth.filter(applicant => applicant.stage === 'candidateNotInterested').length;
        this.selectedApplicants = this.applicantsCurrentMonth.filter(applicant => applicant.stage === 'selected').length;
        this.createOpensMonthChart();
      });
    } catch (error) {
      this.snackbar.open('Applicant Data could not be fetched', '', { duration: 5000 });
    }

    try {
      this.applicantService.getApplicants(true).subscribe(applicants => {
        for (let i = 0; i < 12; i++) {
          this.opensByMonth.push(
            applicants.filter(applicant => new Date(applicant.createdAt).getMonth() === i && new Date(applicant.createdAt).getFullYear() === this.CURRENT_YEAR).length
          );
        }
        try {
          this.memberService.getMembers(true).subscribe(members => {
            for (let i = 0; i < 12; i++) {
              this.selectedByMonth.push(
                members.filter(member => new Date(member.createdAt).getMonth() === i && new Date(member.createdAt).getFullYear() === this.CURRENT_YEAR).length
              );
            }
            this.createOpensYearChart();
          });
        } catch (error) {
          this.snackbar.open('Data could not be fetched', '', { duration: 5000 });
        }
      });
    } catch(error) {
      this.snackbar.open('Applicant Data could not be fetched', '', { duration: 5000 });
    }
    
  }

  public createOpensMonthChart() {
    const labels = ['Open', 'Interviewed', 'Rejected', 'Not Interested', 'Selected'];
    new Chart('opensMonth', {
      type: 'polarArea',
      data: {
        labels: labels, 
        datasets: [
          {
            label: '',
            data: [
              this.openApplicants,
              this.interviewedApplicants,
              this.rejectedApplicants,
              this.notInterestedApplicants,
              this.selectedApplicants
            ],
            backgroundColor: [
              this.blueOpacity,
              this.purpleOpacity,
              this.redOpacity,
              this.yellowOpacity,
              this.greenOpacity
            ]
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: '3 - Opens this Month'
          }
        }
      }
    });
  }

  public createOpensYearChart() {
    new Chart('opensYear', {
      type: 'bar',
      data: {
        labels: [
          'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
          'September', 'October', 'November', 'December'
        ], 
        datasets: [
          {
            label: 'Opens',
            data: [
              this.opensByMonth[0], this.opensByMonth[1], this.opensByMonth[2], this.opensByMonth[3],
              this.opensByMonth[4], this.opensByMonth[5], this.opensByMonth[6], this.opensByMonth[7],
              this.opensByMonth[8], this.opensByMonth[9], this.opensByMonth[10], this.opensByMonth[11]
            ],
            backgroundColor: this.orange
          },
          {
            label: 'Selected',
            data: [
              this.selectedByMonth[0], this.selectedByMonth[1], this.selectedByMonth[2],
              this.selectedByMonth[3], this.selectedByMonth[4], this.selectedByMonth[5],
              this.selectedByMonth[6], this.selectedByMonth[7], this.selectedByMonth[8],
              this.selectedByMonth[9], this.selectedByMonth[10], this.selectedByMonth[11]
            ],
            backgroundColor: this.purple
          }  
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        aspectRatio: 0.5,
        plugins: {
          title: {
            display: true,
            text: '1 - Opens vs Selected this Year'
          }
        }
      }
    });
  }

  public memberCharts() {
    try {
      this.memberService.getMembers(false).subscribe(members => {
        this.mktMembers = members.filter(member => member.currentRole.function === 'marketing').length;
        this.tmMembers = members.filter(member => member.currentRole.function === 'talentManagement').length;
        this.finMembers = members.filter(member => member.currentRole.function === 'finance').length;
        this.ogvMembers = members.filter(member => member.currentRole.function === 'outgoingGlobalVolunteer').length;
        this.ogtMembers = members.filter(member => member.currentRole.function === 'outgoingGlobalTalent').length;
        this.igvMembers = members.filter(member => member.currentRole.function === 'incomingGlobalVolunteer').length;
        this.igtMembers = members.filter(member => member.currentRole.function === 'incomingGlobalTalent').length;
        this.createMemberFunctionChart();
      });
    } catch (error) {
      this.snackbar.open('Member Data could not be fetched', '', { duration: 5000 });
    }
  }

  public createMemberFunctionChart() {
    new Chart('memberFunctions', {
      type: 'bar',
      data: {
        labels: [
          'TM', 'MKT', 'FIN', 'oGV', 'oGT', 'iGV', 'iGT'
        ], 
        datasets: [
          {
            label: 'Members by Function',
            data: [
              this.tmMembers, this.mktMembers, this.finMembers, this.ogvMembers,
              this.ogtMembers, this.igvMembers, this.igtMembers
            ],
            backgroundColor: this.blue
          }
        ]
      },
      options: {
        responsive: true,
        aspectRatio: 2.5,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: '2 - Members by Function'
          }
        }
      }
    });
  }
}
